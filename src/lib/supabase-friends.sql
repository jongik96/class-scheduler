-- 친구 관계 테이블
CREATE TABLE friends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'accepted', 'blocked')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

-- 친구 초대 테이블
CREATE TABLE friend_invites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invite_code TEXT UNIQUE NOT NULL,
  inviter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  invitee_email TEXT,
  status TEXT CHECK (status IN ('pending', 'accepted', 'expired')) DEFAULT 'pending',
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 과제 공유 테이블
CREATE TABLE assignment_shares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  shared_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  shared_with UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  permission TEXT CHECK (permission IN ('view', 'edit', 'admin')) DEFAULT 'view',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(assignment_id, shared_with)
);

-- RLS 활성화
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE friend_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_shares ENABLE ROW LEVEL SECURITY;

-- 친구 테이블 정책
CREATE POLICY "Users can view their own friends" ON friends
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can insert friend requests" ON friends
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own friend relationships" ON friends
  FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- 친구 초대 테이블 정책
CREATE POLICY "Users can view their own invites" ON friend_invites
  FOR SELECT USING (auth.uid() = inviter_id OR invitee_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Users can create invites" ON friend_invites
  FOR INSERT WITH CHECK (auth.uid() = inviter_id);

CREATE POLICY "Users can update their own invites" ON friend_invites
  FOR UPDATE USING (auth.uid() = inviter_id);

-- 과제 공유 테이블 정책
CREATE POLICY "Users can view shared assignments" ON assignment_shares
  FOR SELECT USING (auth.uid() = shared_with OR auth.uid() = shared_by);

CREATE POLICY "Users can share assignments" ON assignment_shares
  FOR INSERT WITH CHECK (auth.uid() = shared_by);

CREATE POLICY "Users can update their own shares" ON assignment_shares
  FOR UPDATE USING (auth.uid() = shared_by);

-- 인덱스 생성
CREATE INDEX idx_friends_user_id ON friends(user_id);
CREATE INDEX idx_friends_friend_id ON friends(friend_id);
CREATE INDEX idx_friends_status ON friends(status);
CREATE INDEX idx_friend_invites_code ON friend_invites(invite_code);
CREATE INDEX idx_friend_invites_inviter ON friend_invites(inviter_id);
CREATE INDEX idx_assignment_shares_assignment ON assignment_shares(assignment_id);
CREATE INDEX idx_assignment_shares_shared_with ON assignment_shares(shared_with);

-- 함수 생성
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
BEGIN
  RETURN 'INVITE_' || substr(md5(random()::text), 1, 8);
END;
$$ LANGUAGE plpgsql;

-- 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_friends_updated_at 
  BEFORE UPDATE ON friends 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
