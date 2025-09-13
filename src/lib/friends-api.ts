import { supabase } from './supabase';

export interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
  updated_at: string;
  friend_profile?: {
    id: string;
    full_name: string;
    nickname: string;
    avatar_url?: string;
    major?: string;
    grade?: string;
  };
}

export interface FriendInvite {
  id: string;
  invite_code: string;
  inviter_id: string;
  invitee_email?: string;
  status: 'pending' | 'accepted' | 'expired';
  expires_at: string;
  created_at: string;
  inviter_profile?: {
    full_name: string;
    nickname: string;
    avatar_url?: string;
  };
}

export interface AssignmentShare {
  id: string;
  assignment_id: string;
  shared_by: string;
  shared_with: string;
  permission: 'view' | 'edit' | 'admin';
  created_at: string;
  shared_with_profile?: {
    full_name: string;
    nickname: string;
    avatar_url?: string;
  };
}

// 친구 초대 링크 생성
export async function createFriendInvite(): Promise<{ invite_code: string; invite_url: string } | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User is not logged in.');

    // Check if existing invite exists
    const { data: existingInvite } = await supabase
      .from('friend_invites')
      .select('*')
      .eq('inviter_id', user.id)
      .eq('status', 'pending')
      .single();

    let inviteCode: string;

    if (existingInvite) {
      inviteCode = existingInvite.invite_code;
    } else {
      // Generate new invite code
      const { data: newInvite, error } = await supabase
        .from('friend_invites')
        .insert({
          inviter_id: user.id,
          invite_code: `INVITE_${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })
        .select('invite_code')
        .single();

      if (error) throw error;
      inviteCode = newInvite.invite_code;
    }

    const inviteUrl = `${window.location.origin}/invite/${inviteCode}`;
    return { invite_code: inviteCode, invite_url: inviteUrl };
  } catch (error) {
    console.error('Friend invite creation error:', error);
    return null;
  }
}

// 친구 초대 링크로 친구 추가
export async function acceptFriendInvite(inviteCode: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User is not logged in.');

    // Check invite code
    const { data: invite, error: inviteError } = await supabase
      .from('friend_invites')
      .select('*')
      .eq('invite_code', inviteCode)
      .eq('status', 'pending')
      .single();

    if (inviteError || !invite) throw new Error('Invalid invite code.');

    // Check if already friends
    const { data: existingFriend } = await supabase
      .from('friends')
      .select('*')
      .or(`and(user_id.eq.${user.id},friend_id.eq.${invite.inviter_id}),and(user_id.eq.${invite.inviter_id},friend_id.eq.${user.id})`)
      .single();

    if (existingFriend) throw new Error('Already friends.');

    // Create friend relationship (only one direction, will be queried bidirectionally)
    const { error: friendError } = await supabase
      .from('friends')
      .insert({
        user_id: user.id, 
        friend_id: invite.inviter_id, 
        status: 'accepted'
      });

    if (friendError) throw friendError;

    // Update invite status
    await supabase
      .from('friend_invites')
      .update({ status: 'accepted' })
      .eq('id', invite.id);

    return true;
  } catch (error) {
    console.error('Friend invite acceptance error:', error);
    return false;
  }
}

// Get friends list
export async function getFriends(): Promise<Friend[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User is not logged in.');
    
    console.log('Current user ID:', user.id);

    // First get friends, then get profiles separately to avoid foreign key issues
    const { data: friends, error: friendsError } = await supabase
      .from('friends')
      .select('*')
      .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
      .eq('status', 'accepted');

    if (friendsError) {
      console.error('Error fetching friends:', friendsError);
      throw friendsError;
    }
    
    console.log('Raw friends data:', friends);
    
    if (!friends || friends.length === 0) {
      console.log('No friends found');
      return [];
    }
    
    // Get all unique friend IDs (excluding the current user)
    const friendIds = friends.map(friend => 
      friend.user_id === user.id ? friend.friend_id : friend.user_id
    );
    
    console.log('Friend IDs to fetch profiles for:', friendIds);
    
    // Get profiles for all friends
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, nickname, avatar_url, major, grade')
      .in('id', friendIds);
    
    console.log('Profiles fetched:', profiles);
    console.log('Profile error if any:', profileError);
    
    // Create profile map
    let profileMap = new Map();
    if (profiles && profiles.length > 0) {
      profileMap = new Map(profiles.map(p => [p.id, p]));
      console.log('Profile map created successfully');
    } else {
      console.log('No profiles found - this might be due to RLS policies');
    }
    
    // Transform friends to include profile data
    const friendsWithProfiles = friends.map(friend => {
      const isUserInitiator = friend.user_id === user.id;
      const otherPersonId = isUserInitiator ? friend.friend_id : friend.user_id;
      const otherPersonProfile = profileMap.get(otherPersonId);
      
      return {
        ...friend,
        user_id: user.id,
        friend_id: otherPersonId,
        friend_profile: otherPersonProfile
      };
    });

    console.log('Final friends with profiles:', friendsWithProfiles);
    return friendsWithProfiles;
  } catch (error) {
    console.error('Friends list retrieval error:', error);
    return [];
  }
}

// Get received friend invites
export async function getReceivedInvites(): Promise<FriendInvite[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User is not logged in.');
    
    console.log('Getting invites for user:', user.email);

    // First get the invites
    const { data: invites, error } = await supabase
      .from('friend_invites')
      .select('*')
      .eq('invitee_email', user.email)
      .eq('status', 'pending');

    if (error) {
      console.error('Error fetching invites:', error);
      throw error;
    }
    
    console.log('Raw invites data:', invites);
    
    if (!invites || invites.length === 0) {
      console.log('No invites found');
      return [];
    }
    
    // Get profiles for all inviters
    const inviterIds = invites.map(invite => invite.inviter_id);
    console.log('Inviter IDs to fetch profiles for:', inviterIds);
    
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, nickname, avatar_url')
      .in('id', inviterIds);
    
    console.log('Inviter profiles fetched:', profiles);
    console.log('Profile error if any:', profileError);
    
    if (profileError) {
      console.error('Profile retrieval error for invites:', profileError);
      // Return invites without profiles if profile fetch fails
      return invites.map(invite => ({
        ...invite,
        inviter_profile: null
      }));
    }
    
    // Create a map of profiles
    const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
    console.log('Inviter profile map created:', profileMap);
    
    // Attach profiles to invites
    const invitesWithProfiles = invites.map(invite => {
      const profile = profileMap.get(invite.inviter_id);
      console.log(`Invite ${invite.id}: inviter_id=${invite.inviter_id}, profile=`, profile);
      
      return {
        ...invite,
        inviter_profile: profile
      };
    });
    
    console.log('Final invites with profiles:', invitesWithProfiles);
    return invitesWithProfiles;
  } catch (error) {
    console.error('Received invites retrieval error:', error);
    return [];
  }
}

// User profile type definition
interface UserProfile {
  id: string;
  full_name: string;
  nickname: string;
  major?: string;
  grade?: string;
}

// Search users
export async function searchUsers(_query: string): Promise<UserProfile[]> {
  try {
    // 임시로 비활성화 - profiles 테이블 문제 해결 후 활성화
    console.log('User search temporarily disabled - profiles table not properly configured');
    return [];
    
    /*
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User is not logged in.');

    const { data: users, error } = await supabase
      .from('profiles')
      .select('id, full_name, nickname, major, grade')
      .or(`full_name.ilike.%${query}%,nickname.ilike.%${query}%,major.ilike.%${query}%`)
      .neq('id', user.id)
      .limit(10);

    if (error) throw error;
    return users || [];
    */
  } catch (error) {
    console.error('User search error:', error);
    return [];
  }
}

// Remove friend
export async function removeFriend(friendId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User is not logged in.');

    const { error } = await supabase
      .from('friends')
      .delete()
      .or(`and(user_id.eq.${user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${user.id})`);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Friend removal error:', error);
    return false;
  }
}

// Share assignment
export async function shareAssignment(assignmentId: string, friendIds: string[], permission: 'view' | 'edit' = 'view'): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User is not logged in.');

    const shares = friendIds.map(friendId => ({
      assignment_id: assignmentId,
      shared_by: user.id,
      shared_with: friendId,
      permission
    }));

    const { error } = await supabase
      .from('assignment_shares')
      .insert(shares);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Assignment sharing error:', error);
    return false;
  }
}

// Get assignment shares
export async function getAssignmentShares(assignmentId: string): Promise<AssignmentShare[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User is not logged in.');

    // First, get the shares without profile information
    const { data: shares, error } = await supabase
      .from('assignment_shares')
      .select('*')
      .eq('assignment_id', assignmentId)
      .eq('shared_by', user.id);

    if (error) throw error;
    
    if (!shares || shares.length === 0) return [];
    
    // Then, get the profiles for the shared_with users
    const sharedWithIds = shares.map(share => share.shared_with);
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, nickname, avatar_url')
      .in('id', sharedWithIds);
    
    if (profileError) {
      console.error('Profile retrieval error:', profileError);
      return shares; // Return shares without profiles if profile fetch fails
    }
    
    // Map profiles to shares
    const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
    const sharesWithProfiles = shares.map(share => ({
      ...share,
      shared_with_profile: profileMap.get(share.shared_with)
    }));
    
    return sharesWithProfiles;
  } catch (error) {
    console.error('Assignment shares retrieval error:', error);
    return [];
  }
}

// Shared assignment type definition
interface SharedAssignment {
  id: string;
  assignment_id: string;
  shared_by: string;
  shared_with: string;
  permission: 'view' | 'edit' | 'admin';
  created_at: string;
  assignment?: {
    id: string;
    title: string;
    description?: string;
    due_date?: string;
    status?: string;
  };
  shared_by_profile?: {
    full_name: string;
    nickname: string;
    avatar_url?: string;
  };
}

// Get shared assignments
export async function getSharedAssignments(): Promise<SharedAssignment[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User is not logged in.');

    const { data: shares, error } = await supabase
      .from('assignment_shares')
      .select(`
        *,
        assignment:assignments(*),
        shared_by_profile:profiles!assignment_shares_shared_by_fkey(
          full_name,
          nickname,
          avatar_url
        )
      `)
      .eq('shared_with', user.id);

    if (error) throw error;
    return shares || [];
  } catch (error) {
    console.error('Shared assignments retrieval error:', error);
    return [];
  }
}
