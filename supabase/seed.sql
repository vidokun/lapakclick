-- ============================================================
-- lapak.click — Seed Data
-- Test users, subdomains, DNS records, and activity log entries
-- ============================================================

-- ============================================================
-- 1. TEST USERS (auth.users)
-- Uses deterministic UUIDs for easy cross-referencing
-- Passwords: both users have password = "password123"
-- ============================================================
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token,
  is_sso_user,
  is_anonymous
) VALUES
(
  'a0000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'warung@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Budi Santoso"}',
  now(),
  now(),
  '', '', '', '',
  false,
  false
),
(
  'a0000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'toko@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Siti Rahma"}',
  now(),
  now(),
  '', '', '', '',
  false,
  false
);

-- ============================================================
-- 2. SUBDOMAINS
-- User 1 (Budi): 2 subdomains — warungku, toko
-- User 2 (Siti): 1 subdomain — katering
-- ============================================================
INSERT INTO subdomains (id, user_id, name, target, status, ssl_status, last_active_at, created_at, updated_at)
VALUES
(
  'b0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'warungku',
  '192.168.1.10',
  'active',
  'active',
  now() - INTERVAL '2 hours',
  now() - INTERVAL '21 days',
  now() - INTERVAL '2 hours'
),
(
  'b0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000001',
  'toko',
  '192.168.1.20',
  'active',
  'active',
  now() - INTERVAL '1 day',
  now() - INTERVAL '25 days',
  now() - INTERVAL '1 day'
),
(
  'b0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000002',
  'katering',
  '192.168.1.30',
  'active',
  'pending',
  now() - INTERVAL '3 days',
  now() - INTERVAL '30 days',
  now() - INTERVAL '3 days'
);

-- ============================================================
-- 3. DNS RECORDS
-- warungku: A record @ → 192.168.1.10, CNAME www → warungku
-- toko: A record @ → 192.168.1.20
-- katering: A record @ → 192.168.1.30, CNAME www → katering
-- ============================================================
INSERT INTO dns_records (id, subdomain_id, type, name, value, ttl, priority, cloudflare_id)
VALUES
-- warungku.lapak.click
(
  'c0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  'A', '@', '192.168.1.10', 3600, NULL,
  'cf-warungku-a-001'
),
(
  'c0000000-0000-0000-0000-000000000002',
  'b0000000-0000-0000-0000-000000000001',
  'CNAME', 'www', 'warungku.lapak.click', 3600, NULL,
  'cf-warungku-cname-001'
),
-- toko.lapak.click
(
  'c0000000-0000-0000-0000-000000000003',
  'b0000000-0000-0000-0000-000000000002',
  'A', '@', '192.168.1.20', 3600, NULL,
  'cf-toko-a-001'
),
-- katering.lapak.click
(
  'c0000000-0000-0000-0000-000000000004',
  'b0000000-0000-0000-0000-000000000003',
  'A', '@', '192.168.1.30', 3600, NULL,
  'cf-katering-a-001'
),
(
  'c0000000-0000-0000-0000-000000000005',
  'b0000000-0000-0000-0000-000000000003',
  'CNAME', 'www', 'katering.lapak.click', 3600, NULL,
  'cf-katering-cname-001'
);

-- ============================================================
-- 4. ACTIVITY LOGS
-- Each user has sample activity entries
-- ============================================================
INSERT INTO activity_logs (id, user_id, action, details, created_at)
VALUES
-- User 1 (Budi)
(
  'd0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'subdomain_created',
  '{"subdomain_id":"b0000000-0000-0000-0000-000000000001","name":"warungku","domain":"warungku.lapak.click"}',
  now() - INTERVAL '21 days'
),
(
  'd0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000001',
  'dns_added',
  '{"subdomain_id":"b0000000-0000-0000-0000-000000000001","subdomain":"warungku","type":"A","value":"192.168.1.10"}',
  now() - INTERVAL '21 days'
),
(
  'd0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000001',
  'dns_added',
  '{"subdomain_id":"b0000000-0000-0000-0000-000000000001","subdomain":"warungku","type":"CNAME","name":"www","value":"warungku.lapak.click"}',
  now() - INTERVAL '20 days'
),
(
  'd0000000-0000-0000-0000-000000000004',
  'a0000000-0000-0000-0000-000000000001',
  'subdomain_created',
  '{"subdomain_id":"b0000000-0000-0000-0000-000000000002","name":"toko","domain":"toko.lapak.click"}',
  now() - INTERVAL '25 days'
),
(
  'd0000000-0000-0000-0000-000000000005',
  'a0000000-0000-0000-0000-000000000001',
  'dns_updated',
  '{"subdomain_id":"b0000000-0000-0000-0000-000000000002","subdomain":"toko","type":"A","old_value":"192.168.1.1","new_value":"192.168.1.20"}',
  now() - INTERVAL '1 day'
),
-- User 2 (Siti)
(
  'd0000000-0000-0000-0000-000000000006',
  'a0000000-0000-0000-0000-000000000002',
  'subdomain_created',
  '{"subdomain_id":"b0000000-0000-0000-0000-000000000003","name":"katering","domain":"katering.lapak.click"}',
  now() - INTERVAL '30 days'
),
(
  'd0000000-0000-0000-0000-000000000007',
  'a0000000-0000-0000-0000-000000000002',
  'dns_added',
  '{"subdomain_id":"b0000000-0000-0000-0000-000000000003","subdomain":"katering","type":"A","value":"192.168.1.30"}',
  now() - INTERVAL '30 days'
),
(
  'd0000000-0000-0000-0000-000000000008',
  'a0000000-0000-0000-0000-000000000002',
  'dns_added',
  '{"subdomain_id":"b0000000-0000-0000-0000-000000000003","subdomain":"katering","type":"CNAME","name":"www","value":"katering.lapak.click"}',
  now() - INTERVAL '29 days'
);
