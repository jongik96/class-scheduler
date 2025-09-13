-- =====================================================
-- 스케줄러 데이터베이스 스키마
-- =====================================================

-- 사용자 프로필 테이블
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  nickname TEXT,
  student_id TEXT,
  major TEXT,
  grade TEXT,
  avatar_url TEXT,
  is_profile_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 수업 테이블
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_name TEXT NOT NULL,
  course_code TEXT,
  professor TEXT,
  day_of_week TEXT CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room TEXT,
  color TEXT DEFAULT '#3b82f6',
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 과제 테이블
CREATE TABLE IF NOT EXISTS assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending',
  is_shared BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 친구 관계 테이블
CREATE TABLE IF NOT EXISTS friends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'accepted', 'blocked')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

-- 친구 초대 테이블
CREATE TABLE IF NOT EXISTS friend_invites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invite_code TEXT UNIQUE NOT NULL,
  inviter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  invitee_email TEXT,
  status TEXT CHECK (status IN ('pending', 'accepted', 'expired')) DEFAULT 'pending',
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 과제 공유 테이블
CREATE TABLE IF NOT EXISTS assignment_shares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  shared_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  shared_with UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  permission TEXT CHECK (permission IN ('view', 'edit', 'admin')) DEFAULT 'view',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(assignment_id, shared_with)
);

-- 과제 진행상황 추적 테이블
CREATE TABLE IF NOT EXISTS assignment_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  progress_percentage INTEGER CHECK (progress_percentage >= 0 AND progress_percentage <= 100) DEFAULT 0,
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(assignment_id, user_id)
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) 활성화
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE friend_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_progress ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 보안 정책 (Policies)
-- =====================================================

-- 프로필 테이블 정책
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view friends' profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM friends 
      WHERE (user_id = auth.uid() AND friend_id = id) 
         OR (friend_id = auth.uid() AND user_id = id)
      AND status = 'accepted'
    )
  );

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 수업 테이블 정책
CREATE POLICY "Users can view their own courses" ON courses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own courses" ON courses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own courses" ON courses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own courses" ON courses
  FOR DELETE USING (auth.uid() = user_id);

-- 과제 테이블 정책
CREATE POLICY "Users can view their own assignments" ON assignments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assignments" ON assignments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assignments" ON assignments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assignments" ON assignments
  FOR DELETE USING (auth.uid() = user_id);

-- 친구 테이블 정책
CREATE POLICY "Users can view their own friends" ON friends
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can insert friend requests" ON friends
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own friend relationships" ON friends
  FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can delete their own friend relationships" ON friends
  FOR DELETE USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- 친구 초대 테이블 정책
CREATE POLICY "Users can view their own invites" ON friend_invites
  FOR SELECT USING (auth.uid() = inviter_id OR invitee_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Users can create invites" ON friend_invites
  FOR INSERT WITH CHECK (auth.uid() = inviter_id);

CREATE POLICY "Users can update their own invites" ON friend_invites
  FOR UPDATE USING (auth.uid() = inviter_id);

CREATE POLICY "Users can delete their own invites" ON friend_invites
  FOR DELETE USING (auth.uid() = inviter_id);

-- 과제 공유 테이블 정책
CREATE POLICY "Users can view shared assignments" ON assignment_shares
  FOR SELECT USING (auth.uid() = shared_with OR auth.uid() = shared_by);

CREATE POLICY "Users can share assignments" ON assignment_shares
  FOR INSERT WITH CHECK (auth.uid() = shared_by);

CREATE POLICY "Users can update their own shares" ON assignment_shares
  FOR UPDATE USING (auth.uid() = shared_by);

CREATE POLICY "Users can delete their own shares" ON assignment_shares
  FOR DELETE USING (auth.uid() = shared_by);

-- 과제 진행상황 테이블 정책
CREATE POLICY "Users can view assignment progress" ON assignment_progress
  FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM assignment_shares 
      WHERE assignment_id = assignment_progress.assignment_id 
      AND shared_with = auth.uid()
    )
  );

CREATE POLICY "Users can update their own progress" ON assignment_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON assignment_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress" ON assignment_progress
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 인덱스 생성
-- =====================================================

-- 프로필 인덱스
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_student_id ON profiles(student_id);

-- 수업 인덱스
CREATE INDEX IF NOT EXISTS idx_courses_user_id ON courses(user_id);
CREATE INDEX IF NOT EXISTS idx_courses_day_of_week ON courses(day_of_week);
CREATE INDEX IF NOT EXISTS idx_courses_course_code ON courses(course_code);
CREATE INDEX IF NOT EXISTS idx_courses_is_active ON courses(is_active);

-- 과제 인덱스
CREATE INDEX IF NOT EXISTS idx_assignments_user_id ON assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_assignments_course_id ON assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_assignments_due_date ON assignments(due_date);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON assignments(status);
CREATE INDEX IF NOT EXISTS idx_assignments_priority ON assignments(priority);

-- 친구 인덱스
CREATE INDEX IF NOT EXISTS idx_friends_user_id ON friends(user_id);
CREATE INDEX IF NOT EXISTS idx_friends_friend_id ON friends(friend_id);
CREATE INDEX IF NOT EXISTS idx_friends_status ON friends(status);

-- 친구 초대 인덱스
CREATE INDEX IF NOT EXISTS idx_friend_invites_code ON friend_invites(invite_code);
CREATE INDEX IF NOT EXISTS idx_friend_invites_inviter ON friend_invites(inviter_id);
CREATE INDEX IF NOT EXISTS idx_friend_invites_status ON friend_invites(status);

-- 과제 공유 인덱스
CREATE INDEX IF NOT EXISTS idx_assignment_shares_assignment ON assignment_shares(assignment_id);
CREATE INDEX IF NOT EXISTS idx_assignment_shares_shared_with ON assignment_shares(shared_with);

-- 과제 진행상황 인덱스
CREATE INDEX IF NOT EXISTS idx_assignment_progress_assignment ON assignment_progress(assignment_id);
CREATE INDEX IF NOT EXISTS idx_assignment_progress_user ON assignment_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_assignment_progress_status ON assignment_progress(status);

-- =====================================================
-- 함수 및 트리거
-- =====================================================

-- 친구 초대 코드 생성 함수
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
BEGIN
  RETURN 'INVITE_' || substr(md5(random()::text), 1, 8);
END;
$$ LANGUAGE plpgsql;

-- 업데이트 시간 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at 
  BEFORE UPDATE ON courses 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at 
  BEFORE UPDATE ON assignments 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_friends_updated_at 
  BEFORE UPDATE ON friends 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assignment_progress_updated_at 
  BEFORE UPDATE ON assignment_progress 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 샘플 데이터 (선택사항)
-- =====================================================

-- 샘플 수업 데이터 (실제 사용 시 제거)
-- INSERT INTO courses (user_id, course_name, course_code, professor, day_of_week, start_time, end_time, room, color) VALUES
-- ('your-user-id', '웹 프로그래밍', 'CS101', '김교수', 'monday', '09:00', '10:30', '101호', '#3b82f6'),
-- ('your-user-id', '데이터베이스', 'CS201', '이교수', 'tuesday', '14:00', '15:30', '202호', '#10b981');

-- 샘플 과제 데이터 (실제 사용 시 제거)
-- INSERT INTO assignments (user_id, course_id, title, description, due_date, priority, status) VALUES
-- ('your-user-id', 'course-id-1', '웹사이트 제작', 'HTML/CSS를 사용한 반응형 웹사이트 제작', NOW() + INTERVAL '7 days', 'high', 'pending');
