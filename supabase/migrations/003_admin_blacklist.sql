-- ============================================================
-- lapak.click — Database Migration 003: Admin Blacklist
-- Table: blacklist (subdomain name blacklist for admin)
-- RLS: Admin-only access policies
-- ============================================================

-- ============================================================
-- 1. TABLE: blacklist
-- ============================================================
CREATE TABLE IF NOT EXISTS blacklist (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern     TEXT        NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by  UUID        REFERENCES auth.users(id)
);

-- ============================================================
-- 2. ROW-LEVEL SECURITY
-- ============================================================
ALTER TABLE blacklist ENABLE ROW LEVEL SECURITY;

-- 2a. Admin can SELECT blacklist entries
CREATE POLICY "Admin can view blacklist"
  ON blacklist
  FOR SELECT
  USING (
    (auth.jwt() ->> 'user_metadata' ->> 'role') = 'admin'
  );

-- 2b. Admin can INSERT blacklist entries
CREATE POLICY "Admin can insert blacklist"
  ON blacklist
  FOR INSERT
  WITH CHECK (
    (auth.jwt() ->> 'user_metadata' ->> 'role') = 'admin'
  );

-- 2c. Admin can DELETE blacklist entries
CREATE POLICY "Admin can delete blacklist"
  ON blacklist
  FOR DELETE
  USING (
    (auth.jwt() ->> 'user_metadata' ->> 'role') = 'admin'
  );
