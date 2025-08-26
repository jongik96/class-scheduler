import { supabase } from './supabase';

// =====================================================
// 타입 정의
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
// 수업 관리 API (Courses)
// =====================================================

export const coursesApi = {
  // 수업 목록 조회
  async getCourses(): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_active', true)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // 수업 생성
  async createCourse(courseData: Omit<Course, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Course> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('사용자가 로그인되지 않았습니다.');

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

  // 수업 수정
  async updateCourse(id: string, updates: Partial<Course>): Promise<Course> {
    const { data, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 수업 삭제 (소프트 삭제)
  async deleteCourse(id: string): Promise<void> {
    const { error } = await supabase
      .from('courses')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;
  },

  // 특정 요일 수업 조회
  async getCoursesByDay(dayOfWeek: Course['day_of_week']): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('day_of_week', dayOfWeek)
      .eq('is_active', true)
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data || [];
  }
};

// =====================================================
// 과제 관리 API (Assignments)
// =====================================================

export const assignmentsApi = {
  // 과제 목록 조회
  async getAssignments(): Promise<Assignment[]> {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // 과제 생성
  async createAssignment(assignmentData: Omit<Assignment, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Assignment> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('사용자가 로그인되지 않았습니다.');

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

  // 과제 수정
  async updateAssignment(id: string, updates: Partial<Assignment>): Promise<Assignment> {
    const { data, error } = await supabase
      .from('assignments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 과제 삭제
  async deleteAssignment(id: string): Promise<void> {
    const { error } = await supabase
      .from('assignments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // 과제 상태별 조회
  async getAssignmentsByStatus(status: Assignment['status']): Promise<Assignment[]> {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('status', status)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // 마감일이 임박한 과제 조회
  async getUpcomingAssignments(days: number = 7): Promise<Assignment[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .gte('due_date', new Date().toISOString())
      .lte('due_date', futureDate.toISOString())
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data || [];
  }
};

// =====================================================
// 프로필 관리 API (Profiles)
// =====================================================

export const profilesApi = {
  // 프로필 조회
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

  // 프로필 생성/수정
  async upsertProfile(profileData: Partial<Profile>): Promise<Profile> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('사용자가 로그인되지 않았습니다.');

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

  // 프로필 완성 상태 업데이트
  async updateProfileComplete(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('사용자가 로그인되지 않았습니다.');

    const { error } = await supabase
      .from('profiles')
      .update({ is_profile_complete: true })
      .eq('id', user.id);

    if (error) throw error;
  }
};

// =====================================================
// 친구 관리 API (Friends)
// =====================================================

export const friendsApi = {
  // 친구 목록 조회
  async getFriends(): Promise<Friend[]> {
    const { data, error } = await supabase
      .from('friends')
      .select('*')
      .eq('status', 'accepted')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // 친구 요청 목록 조회
  async getFriendRequests(): Promise<Friend[]> {
    const { data, error } = await supabase
      .from('friends')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // 친구 요청 보내기
  async sendFriendRequest(friendId: string): Promise<Friend> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('사용자가 로그인되지 않았습니다.');

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

  // 친구 요청 수락/거절
  async respondToFriendRequest(friendId: string, status: 'accepted' | 'blocked'): Promise<void> {
    const { error } = await supabase
      .from('friends')
      .update({ status })
      .eq('friend_id', friendId)
      .eq('status', 'pending');

    if (error) throw error;
  },

  // 친구 삭제
  async removeFriend(friendId: string): Promise<void> {
    const { error } = await supabase
      .from('friends')
      .delete()
      .or(`user_id.eq.${friendId},friend_id.eq.${friendId}`);

    if (error) throw error;
  }
};

// =====================================================
// 친구 초대 API (Friend Invites)
// =====================================================

export const friendInvitesApi = {
  // 초대 코드 생성
  async createInvite(): Promise<FriendInvite> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('사용자가 로그인되지 않았습니다.');

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

  // 초대 코드로 친구 추가
  async acceptInvite(inviteCode: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('사용자가 로그인되지 않았습니다.');

    // 초대 코드 조회
    const { data: invite, error: inviteError } = await supabase
      .from('friend_invites')
      .select('*')
      .eq('invite_code', inviteCode)
      .eq('status', 'pending')
      .single();

    if (inviteError) throw new Error('유효하지 않은 초대 코드입니다.');
    if (invite.expires_at < new Date().toISOString()) throw new Error('만료된 초대 코드입니다.');

    // 친구 관계 생성
    const { error: friendError } = await supabase
      .from('friends')
      .insert([
        { user_id: invite.inviter_id, friend_id: user.id, status: 'accepted' },
        { user_id: user.id, friend_id: invite.inviter_id, status: 'accepted' }
      ]);

    if (friendError) throw friendError;

    // 초대 상태 업데이트
    const { error: updateError } = await supabase
      .from('friend_invites')
      .update({ status: 'accepted' })
      .eq('id', invite.id);

    if (updateError) throw updateError;
  }
};

// =====================================================
// 유틸리티 함수
// =====================================================

export const apiUtils = {
  // 에러 메시지 포맷팅
  formatError(error: any): string {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.error_description) return error.error_description;
    return '알 수 없는 오류가 발생했습니다.';
  },

  // 성공 응답 포맷팅
  formatSuccess<T>(data: T, message?: string) {
    return {
      success: true,
      data,
      message: message || '성공적으로 처리되었습니다.'
    };
  },

  // 에러 응답 포맷팅
  formatErrorResponse(error: any, message?: string) {
    return {
      success: false,
      error: this.formatError(error),
      message: message || '처리 중 오류가 발생했습니다.'
    };
  }
};
