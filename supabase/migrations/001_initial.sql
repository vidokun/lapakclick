-- ============================================================
-- lapak.click — Database Migration 001: Initial Schema
-- Tables: subdomains, dns_records, activity_logs
-- Triggers: updated_at auto-update, subdomain limit enforcement
-- RLS: Basic row-level security (refined in Task 10)
-- ============================================================

-- ============================================================
-- 1. EXTENSION (idempotent)
-- ============================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- 2. TABLES
-- ============================================================

-- 2a. subdomains
CREATE TABLE IF NOT EXISTS subdomains (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name          VARCHAR(63) NOT NULL,
  target        VARCHAR(255),
  status        VARCHAR(20) NOT NULL DEFAULT 'active'
                  CHECK (status IN ('active', 'pending', 'suspended')),
  ssl_status    VARCHAR(20) NOT NULL DEFAULT 'pending'
                  CHECK (ssl_status IN ('active', 'pending', 'unavailable')),
  last_active_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Unique constraint on subdomain name (enforced at DB level)
  CONSTRAINT subdomains_name_unique UNIQUE (name),

  -- Format: lowercase alphanumeric + hyphens, no leading/trailing hyphen
  CONSTRAINT subdomains_name_format CHECK (
    name ~ '^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$'
  )
);

-- Indexes for subdomains
CREATE INDEX IF NOT EXISTS idx_subdomains_user_id ON subdomains (user_id);
CREATE INDEX IF NOT EXISTS idx_subdomains_name     ON subdomains (name);
CREATE INDEX IF NOT EXISTS idx_subdomains_status   ON subdomains (status);

-- 2b. dns_records
CREATE TABLE IF NOT EXISTS dns_records (
  id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  subdomain_id   UUID         NOT NULL REFERENCES subdomains(id) ON DELETE CASCADE,
  type           VARCHAR(10)  NOT NULL
                   CHECK (type IN ('A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS')),
  name           VARCHAR(255) NOT NULL DEFAULT '@',
  value          TEXT         NOT NULL,
  ttl            INTEGER      NOT NULL DEFAULT 120
                   CHECK (ttl >= 60 AND ttl <= 86400),
  priority       INTEGER,
  cloudflare_id  VARCHAR(255),
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Indexes for dns_records
CREATE INDEX IF NOT EXISTS idx_dns_records_subdomain_id ON dns_records (subdomain_id);
CREATE INDEX IF NOT EXISTS idx_dns_records_type         ON dns_records (type);

-- 2c. activity_logs
CREATE TABLE IF NOT EXISTS activity_logs (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action      VARCHAR(50)   NOT NULL,
  details     JSONB,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- Indexes for activity_logs
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id    ON activity_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs (created_at DESC);

-- ============================================================
-- 3. FUNCTIONS
-- ============================================================

-- 3a. Auto-update updated_at column on row modification
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 3b. Check if user has not exceeded the 3-subdomain limit
-- Returns TRUE if user can create more subdomains (< 3)
-- Raises EXCEPTION if limit reached
CREATE OR REPLACE FUNCTION check_subdomain_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  subdomain_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO subdomain_count
  FROM subdomains
  WHERE user_id = NEW.user_id;

  IF subdomain_count >= 3 THEN
    RAISE EXCEPTION 'Subdomain limit reached (3). Hapus subdomain yang tidak digunakan untuk membuat yang baru.';
  END IF;

  RETURN NEW;
END;
$$;

-- ============================================================
-- 4. TRIGGERS
-- ============================================================

-- 4a. Auto-update updated_at for subdomains
CREATE TRIGGER trg_subdomains_updated_at
  BEFORE UPDATE ON subdomains
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 4b. Auto-update updated_at for dns_records
CREATE TRIGGER trg_dns_records_updated_at
  BEFORE UPDATE ON dns_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 4c. Enforce 3-subdomain limit on insert
CREATE TRIGGER trg_enforce_subdomain_limit
  BEFORE INSERT ON subdomains
  FOR EACH ROW
  EXECUTE FUNCTION check_subdomain_limit();

-- ============================================================
-- 5. ROW-LEVEL SECURITY (basic — refined in Task 10)
-- ============================================================

-- 5a. subdomains RLS
ALTER TABLE subdomains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subdomains"
  ON subdomains
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own subdomains"
  ON subdomains
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subdomains"
  ON subdomains
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own subdomains"
  ON subdomains
  FOR DELETE
  USING (auth.uid() = user_id);

-- 5b. dns_records RLS
ALTER TABLE dns_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view DNS records on own subdomains"
  ON dns_records
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM subdomains
      WHERE subdomains.id = dns_records.subdomain_id
      AND subdomains.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create DNS records on own subdomains"
  ON dns_records
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM subdomains
      WHERE subdomains.id = dns_records.subdomain_id
      AND subdomains.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update DNS records on own subdomains"
  ON dns_records
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM subdomains
      WHERE subdomains.id = dns_records.subdomain_id
      AND subdomains.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM subdomains
      WHERE subdomains.id = dns_records.subdomain_id
      AND subdomains.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete DNS records on own subdomains"
  ON dns_records
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM subdomains
      WHERE subdomains.id = dns_records.subdomain_id
      AND subdomains.user_id = auth.uid()
    )
  );

-- 5c. activity_logs RLS
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity"
  ON activity_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can insert activity logs (for automated actions)
CREATE POLICY "Service role can insert activity"
  ON activity_logs
  FOR INSERT
  WITH CHECK (true);
