import { supabase } from './supabase';

// =====================================================
// Utility functions
// =====================================================

// Check current logged in user
async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error('Login required.');
  }
  return user;
}

// =====================================================
// Type definitions
// =====================================================

export interface Course {
  id: string;
  user_id: string;
  course_name: string;
  course_code?: string;
  professor?: string;
  day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  start_time: string;
  end_time: string;
  room?: string;
  color: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Assignment {
  id: string;
  user_id: string;
  course_id?: string;
  title: string;
  description?: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  is_shared: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  nickname?: string;
  student_id?: string;
  major?: string;
  grade?: string;
  avatar_url?: string;
  is_profile_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
  updated_at: string;
}

export interface FriendInvite {
  id: string;
  invite_code: string;
  inviter_id: string;
  invitee_email?: string;
  status: 'pending' | 'accepted' | 'expired';
  expires_at: string;
  created_at: string;
}

// =====================================================
// Course Management API (Courses)
// =====================================================

export const coursesApi = {
  // Get courses list
  async getCourses(): Promise<Course[]> {
    const user = await getCurrentUser();
    
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // 특정 수업 조회
  async getCourse(id: string): Promise<Course | null> {
    const user = await getCurrentUser();
    
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116는 데이터가 없음을 의미
    return data;
  },

  // Create course
  async createCourse(courseData: Omit<Course, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Course> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User is not logged in.');

    const { data, error } = await supabase
      .from('courses')
      .insert([{
        ...courseData,
        user_id: user.id
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update course
  async updateCourse(id: string, updates: Partial<Course>): Promise<Course> {
    const user = await getCurrentUser();
    
    const { data, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete course (soft delete)
  async deleteCourse(id: string): Promise<void> {
    const user = await getCurrentUser();
    
    const { error } = await supabase
      .from('courses')
      .update({ is_active: false })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  },

  // Get courses by specific day
  async getCoursesByDay(dayOfWeek: Course['day_of_week']): Promise<Course[]> {
    const user = await getCurrentUser();
    
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('user_id', user.id)
      .eq('day_of_week', dayOfWeek)
      .eq('is_active', true)
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data || [];
  }
};

// =====================================================
// Assignment Management API (Assignments)
// =====================================================

export const assignmentsApi = {
  // Get assignments list
  async getAssignments(): Promise<Assignment[]> {
    const user = await getCurrentUser();
    
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('user_id', user.id)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get specific assignment
  async getAssignment(id: string): Promise<Assignment | null> {
    const user = await getCurrentUser();
    
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116는 데이터가 없음을 의미
    return data;
  },

  // Create assignment
  async createAssignment(assignmentData: Omit<Assignment, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Assignment> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User is not logged in.');

    const { data, error } = await supabase
      .from('assignments')
      .insert([{
        ...assignmentData,
        user_id: user.id
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update assignment
  async updateAssignment(id: string, updates: Partial<Assignment>): Promise<Assignment> {
    const user = await getCurrentUser();
    
    const { data, error } = await supabase
      .from('assignments')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete assignment
  async deleteAssignment(id: string): Promise<void> {
    const user = await getCurrentUser();
    
    const { error } = await supabase
      .from('assignments')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  },

  // Get assignments by status
  async getAssignmentsByStatus(status: Assignment['status']): Promise<Assignment[]> {
    const user = await getCurrentUser();
    
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', status)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get upcoming assignments
  async getUpcomingAssignments(days: number = 7): Promise<Assignment[]> {
    const user = await getCurrentUser();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('user_id', user.id)
      .gte('due_date', new Date().toISOString())
      .lte('due_date', futureDate.toISOString())
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data || [];
  }
};

// =====================================================
// Profile Management API (Profiles)
// =====================================================

export const profilesApi = {
  // Get profile
  async getProfile(): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116는 데이터가 없음을 의미
    return data;
  },

  // Create/update profile
  async upsertProfile(profileData: Partial<Profile>): Promise<Profile> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User is not logged in.');

    const { data, error } = await supabase
      .from('profiles')
      .upsert([{
        id: user.id,
        email: user.email || '',
        ...profileData
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update profile completion status
  async updateProfileComplete(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User is not logged in.');

    const { error } = await supabase
      .from('profiles')
      .update({ is_profile_complete: true })
      .eq('id', user.id);

    if (error) throw error;
  }
};

// =====================================================
// Friend Management API (Friends)
// =====================================================

export const friendsApi = {
  // Get friends list
  async getFriends(): Promise<Friend[]> {
    const { data, error } = await supabase
      .from('friends')
      .select('*')
      .eq('status', 'accepted')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get friend requests
  async getFriendRequests(): Promise<Friend[]> {
    const { data, error } = await supabase
      .from('friends')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Send friend request
  async sendFriendRequest(friendId: string): Promise<Friend> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User is not logged in.');

    const { data, error } = await supabase
      .from('friends')
      .insert([{
        user_id: user.id,
        friend_id: friendId,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Accept/reject friend request
  async respondToFriendRequest(friendId: string, status: 'accepted' | 'blocked'): Promise<void> {
    const { error } = await supabase
      .from('friends')
      .update({ status })
      .eq('friend_id', friendId)
      .eq('status', 'pending');

    if (error) throw error;
  },

  // Remove friend
  async removeFriend(friendId: string): Promise<void> {
    const { error } = await supabase
      .from('friends')
      .delete()
      .or(`user_id.eq.${friendId},friend_id.eq.${friendId}`);

    if (error) throw error;
  }
};

// =====================================================
// Friend Invite API (Friend Invites)
// =====================================================

export const friendInvitesApi = {
  // Create invite code
  async createInvite(): Promise<FriendInvite> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User is not logged in.');

    const { data, error } = await supabase
      .from('friend_invites')
      .insert([{
        inviter_id: user.id,
        invite_code: `INVITE_${Math.random().toString(36).substr(2, 8).toUpperCase()}`
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Accept invite and add friend
  async acceptInvite(inviteCode: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User is not logged in.');

    // Check invite code
    const { data: invite, error: inviteError } = await supabase
      .from('friend_invites')
      .select('*')
      .eq('invite_code', inviteCode)
      .eq('status', 'pending')
      .single();

    if (inviteError) throw new Error('Invalid invite code.');
    if (invite.expires_at < new Date().toISOString()) throw new Error('Expired invite code.');

    // Create friend relationship
    const { error: friendError } = await supabase
      .from('friends')
      .insert([
        { user_id: invite.inviter_id, friend_id: user.id, status: 'accepted' },
        { user_id: user.id, friend_id: invite.inviter_id, status: 'accepted' }
      ]);

    if (friendError) throw friendError;

    // Update invite status
    const { error: updateError } = await supabase
      .from('friend_invites')
      .update({ status: 'accepted' })
      .eq('id', invite.id);

    if (updateError) throw updateError;
  }
};

// =====================================================
// Utility functions
// =====================================================

export const apiUtils = {
  // Format error message
  formatError(error: unknown): string {
    if (typeof error === 'string') return error;
    if (error && typeof error === 'object' && 'message' in error) {
      return String(error.message);
    }
    if (error && typeof error === 'object' && 'error_description' in error) {
      return String(error.error_description);
    }
    return 'An unknown error occurred.';
  },

  // Format success response
  formatSuccess<T>(data: T, message?: string) {
    return {
      success: true,
      data,
      message: message || 'Successfully processed.'
    };
  },

  // Format error response
  formatErrorResponse(error: unknown, message?: string) {
    return {
      success: false,
      error: this.formatError(error),
      message: message || 'An error occurred during processing.'
    };
  }
};
