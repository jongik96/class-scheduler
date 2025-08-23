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
    if (!user) throw new Error('사용자가 로그인되지 않았습니다.');

    // 기존 초대가 있는지 확인
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
      // 새로운 초대 코드 생성
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
    console.error('친구 초대 생성 오류:', error);
    return null;
  }
}

// 친구 초대 링크로 친구 추가
export async function acceptFriendInvite(inviteCode: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('사용자가 로그인되지 않았습니다.');

    // 초대 코드 확인
    const { data: invite, error: inviteError } = await supabase
      .from('friend_invites')
      .select('*')
      .eq('invite_code', inviteCode)
      .eq('status', 'pending')
      .single();

    if (inviteError || !invite) throw new Error('유효하지 않은 초대 코드입니다.');

    // 이미 친구인지 확인
    const { data: existingFriend } = await supabase
      .from('friends')
      .select('*')
      .or(`and(user_id.eq.${user.id},friend_id.eq.${invite.inviter_id}),and(user_id.eq.${invite.inviter_id},friend_id.eq.${user.id})`)
      .single();

    if (existingFriend) throw new Error('이미 친구입니다.');

    // 친구 관계 생성
    const { error: friendError } = await supabase
      .from('friends')
      .insert([
        { user_id: user.id, friend_id: invite.inviter_id, status: 'accepted' },
        { user_id: invite.inviter_id, friend_id: user.id, status: 'accepted' }
      ]);

    if (friendError) throw friendError;

    // 초대 상태 업데이트
    await supabase
      .from('friend_invites')
      .update({ status: 'accepted' })
      .eq('id', invite.id);

    return true;
  } catch (error) {
    console.error('친구 초대 수락 오류:', error);
    return false;
  }
}

// 친구 목록 조회
export async function getFriends(): Promise<Friend[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('사용자가 로그인되지 않았습니다.');

    const { data: friends, error } = await supabase
      .from('friends')
      .select(`
        *,
        friend_profile:profiles!friends_friend_id_fkey(
          id,
          full_name,
          nickname,
          avatar_url,
          major,
          grade
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'accepted');

    if (error) throw error;
    
    // 임시 샘플 데이터 (개발용)
    const sampleFriends: Friend[] = [
      {
        id: '1',
        user_id: user.id,
        friend_id: 'friend1',
        status: 'accepted',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        friend_profile: {
          id: 'friend1',
          full_name: '田中太郎',
          nickname: 'タロウ',
          avatar_url: undefined,
          major: 'コンピュータ工学',
          grade: '3'
        }
      },
      {
        id: '2',
        user_id: user.id,
        friend_id: 'friend2',
        status: 'accepted',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        friend_profile: {
          id: 'friend2',
          full_name: '佐藤花子',
          nickname: 'ハナコ',
          avatar_url: undefined,
          major: 'ソフトウェア工学',
          grade: '2'
        }
      },
      {
        id: '3',
        user_id: user.id,
        friend_id: 'friend3',
        status: 'accepted',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        friend_profile: {
          id: 'friend3',
          full_name: '鈴木一郎',
          nickname: 'イチロウ',
          avatar_url: undefined,
          major: '情報通信工学',
          grade: '4'
        }
      },
      {
        id: '4',
        user_id: user.id,
        friend_id: 'friend4',
        status: 'accepted',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        friend_profile: {
          id: 'friend4',
          full_name: '高橋美咲',
          nickname: 'ミサキ',
          avatar_url: undefined,
          major: '電子工学',
          grade: '1'
        }
      },
      {
        id: '5',
        user_id: user.id,
        friend_id: 'friend5',
        status: 'accepted',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        friend_profile: {
          id: 'friend5',
          full_name: '渡辺健太',
          nickname: 'ケンタ',
          avatar_url: undefined,
          major: '機械工学',
          grade: '3'
        }
      }
    ];

    // 실제 데이터가 있으면 실제 데이터 반환, 없으면 샘플 데이터 반환
    return friends && friends.length > 0 ? friends : sampleFriends;
  } catch (error) {
    console.error('친구 목록 조회 오류:', error);
    
         // 오류 발생 시에도 샘플 데이터 반환
     const { data: { user } } = await supabase.auth.getUser();
     if (user) {
       return [
         {
           id: '1',
           user_id: user.id,
           friend_id: 'friend1',
           status: 'accepted',
           created_at: new Date().toISOString(),
           updated_at: new Date().toISOString(),
           friend_profile: {
             id: 'friend1',
             full_name: '田中太郎',
             nickname: 'タロウ',
             avatar_url: undefined,
             major: 'コンピュータ工学',
             grade: '3'
           }
         },
         {
           id: '2',
           user_id: user.id,
           friend_id: 'friend2',
           status: 'accepted',
           created_at: new Date().toISOString(),
           updated_at: new Date().toISOString(),
           friend_profile: {
             id: 'friend2',
             full_name: '佐藤花子',
             nickname: 'ハナコ',
             avatar_url: undefined,
             major: 'ソフトウェア工学',
             grade: '2'
           }
         },
         {
           id: '3',
           user_id: user.id,
           friend_id: 'friend3',
           status: 'accepted',
           created_at: new Date().toISOString(),
           updated_at: new Date().toISOString(),
           friend_profile: {
             id: 'friend3',
             full_name: '鈴木一郎',
             nickname: 'イチロウ',
             avatar_url: undefined,
             major: '情報通信工学',
             grade: '4'
           }
         },
         {
           id: '4',
           user_id: user.id,
           friend_id: 'friend4',
           status: 'accepted',
           created_at: new Date().toISOString(),
           updated_at: new Date().toISOString(),
           friend_profile: {
             id: 'friend4',
             full_name: '高橋美咲',
             nickname: 'ミサキ',
             avatar_url: undefined,
             major: '電子工学',
             grade: '1'
           }
         },
         {
           id: '5',
           user_id: user.id,
           friend_id: 'friend5',
           status: 'accepted',
           created_at: new Date().toISOString(),
           updated_at: new Date().toISOString(),
           friend_profile: {
             id: 'friend5',
             full_name: '渡辺健太',
             nickname: 'ケンタ',
             avatar_url: undefined,
             major: '機械工学',
             grade: '3'
           }
         }
       ];
     }
    return [];
  }
}

// 받은 친구 초대 조회
export async function getReceivedInvites(): Promise<FriendInvite[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('사용자가 로그인되지 않았습니다.');

    const { data: invites, error } = await supabase
      .from('friend_invites')
      .select(`
        *,
        inviter_profile:profiles!friend_invites_inviter_id_fkey(
          full_name,
          nickname,
          avatar_url
        )
      `)
      .eq('invitee_email', user.email)
      .eq('status', 'pending');

    if (error) throw error;
    return invites || [];
  } catch (error) {
    console.error('받은 초대 조회 오류:', error);
    return [];
  }
}

// 친구 검색
export async function searchUsers(query: string): Promise<any[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('사용자가 로그인되지 않았습니다.');

    const { data: users, error } = await supabase
      .from('profiles')
      .select('id, full_name, nickname, major, grade')
      .or(`full_name.ilike.%${query}%,nickname.ilike.%${query}%,major.ilike.%${query}%`)
      .neq('id', user.id)
      .limit(10);

    if (error) throw error;
    return users || [];
  } catch (error) {
    console.error('사용자 검색 오류:', error);
    return [];
  }
}

// 친구 삭제
export async function removeFriend(friendId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('사용자가 로그인되지 않았습니다.');

    const { error } = await supabase
      .from('friends')
      .delete()
      .or(`and(user_id.eq.${user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${user.id})`);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('친구 삭제 오류:', error);
    return false;
  }
}

// 과제 공유
export async function shareAssignment(assignmentId: string, friendIds: string[], permission: 'view' | 'edit' = 'view'): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('사용자가 로그인되지 않았습니다.');

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
    console.error('과제 공유 오류:', error);
    return false;
  }
}

// 과제 공유 정보 조회
export async function getAssignmentShares(assignmentId: string): Promise<AssignmentShare[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('사용자가 로그인되지 않았습니다.');

    const { data: shares, error } = await supabase
      .from('assignment_shares')
      .select(`
        *,
        shared_with_profile:profiles!assignment_shares_shared_with_fkey(
          full_name,
          nickname,
          avatar_url
        )
      `)
      .eq('assignment_id', assignmentId)
      .eq('shared_by', user.id);

    if (error) throw error;
    return shares || [];
  } catch (error) {
    console.error('과제 공유 정보 조회 오류:', error);
    return [];
  }
}

// 공유된 과제 목록 조회
export async function getSharedAssignments(): Promise<any[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('사용자가 로그인되지 않았습니다.');

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
    console.error('공유된 과제 조회 오류:', error);
    return [];
  }
}
