-- B2BVoice Database Export
  -- Generated: 2026-07-16T17:01:59.091Z
  -- Run this after setting up your new Replit database

  -- 1. Create tables (schema)
  CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    phone TEXT,
    business_type TEXT,
    business_description TEXT,
    website TEXT,
    demo_needs TEXT,
    demo_type TEXT,
    consent_given BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'partial',
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS seo_settings (
    id SERIAL PRIMARY KEY,
    lang TEXT,
    title TEXT,
    description TEXT,
    keywords TEXT,
    updated_at TIMESTAMP DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS tracking_settings (
    id SERIAL PRIMARY KEY,
    search_console_code TEXT,
    analytics_id TEXT,
    ads_id TEXT,
    ads_conversion_label TEXT,
    updated_at TIMESTAMP DEFAULT now()
  );

  -- 2. Insert leads data
  INSERT INTO leads (id, email, phone, business_type, business_description, website, demo_needs, demo_type, consent_given, status, created_at, updated_at) VALUES
  (1, 'test@example.com', '+1 555 000 0000', NULL, NULL, NULL, NULL, NULL, false, 'partial', '2026-05-21 23:50:13.553678', '2026-05-21 23:50:13.553678'),
  (2, '3ytasarim@gmail.com', '+905050661535', 'Beauty / Nail Salon', NULL, 'https://www.3ytasarim.com', '["Call scheduling","Lead qualification"]', 'google-meet', true, 'complete', '2026-05-21 23:53:44.115969', '2026-05-21 23:54:27.131'),
  (3, '3ytasarim@gmail.com', '+905050661535', 'Other', 'dfdfdfd', '@3ytasarim', '["Answering missed calls"]', 'google-meet', true, 'complete', '2026-05-21 23:54:46.152773', '2026-05-21 23:55:15.787'),
  (4, 'onrcullu@gmail.com', '+905050661535', NULL, NULL, NULL, NULL, NULL, false, 'partial', '2026-05-22 00:03:32.267388', '2026-05-22 00:03:32.267388'),
  (5, '3ytasarim@gmail.com', '905050661535', NULL, NULL, NULL, '["Answering missed calls"]', NULL, false, 'partial', '2026-05-25 01:48:53.207031', '2026-05-25 01:49:03.044'),
  (6, '3ytasarim@gmail.com', '905050661535', 'Beauty / Nail Salon', NULL, NULL, '["Answering missed calls"]', 'google-meet', true, 'complete', '2026-05-25 01:53:46.517231', '2026-05-25 01:54:04.529'),
  (7, '3ytasarim@gmail.com', '905050661535', 'Accounting / Tax Office', NULL, NULL, '["Answering missed calls"]', 'demo-call', true, 'complete', '2026-05-25 01:54:33.175911', '2026-05-25 01:54:48.149');

  -- 3. Reset sequences so new inserts don't conflict
  SELECT setval('leads_id_seq', (SELECT MAX(id) FROM leads));
  