-- 管理者ロール ENUM 型の作成
CREATE TYPE admin_role AS ENUM (
  'SUPER_ADMIN',
  'ADMIN',
  'MODERATOR'
);
