-- 샘플 친구 프로필 데이터 추가
-- 먼저 더미 사용자 ID들을 생성 (실제로는 auth.users 테이블에 있어야 하지만 샘플용)

-- 샘플 프로필 데이터 삽입
INSERT INTO profiles (id, email, full_name, nickname, student_id, major, grade, is_profile_complete, created_at, updated_at) VALUES
('friend1-uuid-0000-0000-000000000001', 'tanaka@university.ac.jp', '田中太郎', 'タロウ', 'CS2021001', 'コンピュータ工学', '3', true, NOW(), NOW()),
('friend2-uuid-0000-0000-000000000002', 'sato@university.ac.jp', '佐藤花子', 'ハナコ', 'SW2022002', 'ソフトウェア工学', '2', true, NOW(), NOW()),
('friend3-uuid-0000-0000-000000000003', 'suzuki@university.ac.jp', '鈴木一郎', 'イチロウ', 'IT2020003', '情報通信工学', '4', true, NOW(), NOW()),
('friend4-uuid-0000-0000-000000000004', 'takahashi@university.ac.jp', '高橋美咲', 'ミサキ', 'EE2023004', '電子工学', '1', true, NOW(), NOW()),
('friend5-uuid-0000-0000-000000000005', 'watanabe@university.ac.jp', '渡辺健太', 'ケンタ', 'ME2021005', '機械工学', '3', true, NOW(), NOW());

-- 현재 로그인한 사용자와의 친구 관계 추가 (실제 사용자 ID로 교체 필요)
-- 이 스크립트는 Supabase Dashboard에서 실행하거나, 실제 사용자 ID로 수정해서 사용하세요.

-- 예시: 현재 사용자 ID가 'your-user-id'라고 가정
-- INSERT INTO friends (user_id, friend_id, status, created_at, updated_at) VALUES
-- ('your-user-id', 'friend1-uuid-0000-0000-000000000001', 'accepted', NOW(), NOW()),
-- ('friend1-uuid-0000-0000-000000000001', 'your-user-id', 'accepted', NOW(), NOW()),
-- ('your-user-id', 'friend2-uuid-0000-0000-000000000002', 'accepted', NOW(), NOW()),
-- ('friend2-uuid-0000-0000-000000000002', 'your-user-id', 'accepted', NOW(), NOW()),
-- ('your-user-id', 'friend3-uuid-0000-0000-000000000003', 'accepted', NOW(), NOW()),
-- ('friend3-uuid-0000-0000-000000000003', 'your-user-id', 'accepted', NOW(), NOW()),
-- ('your-user-id', 'friend4-uuid-0000-0000-000000000004', 'accepted', NOW(), NOW()),
-- ('friend4-uuid-0000-0000-000000000004', 'your-user-id', 'accepted', NOW(), NOW()),
-- ('your-user-id', 'friend5-uuid-0000-0000-000000000005', 'accepted', NOW(), NOW()),
-- ('friend5-uuid-0000-0000-000000000005', 'your-user-id', 'accepted', NOW(), NOW());

-- 주의사항:
-- 1. 'your-user-id'를 실제 Google OAuth로 로그인한 사용자의 UUID로 교체하세요
-- 2. Supabase Dashboard > SQL Editor에서 이 스크립트를 실행하세요
-- 3. 또는 실제 앱에서 Google 로그인 후 개발자 도구에서 user.id를 확인하여 사용하세요
