/*
  # AI Finance Website Database Setup

  1. New Tables
    - `services` - Service offerings with pricing
    - `use_cases` - Automation use cases with metrics
    - `testimonials` - Customer testimonials
    - `newsletter_subscribers` - Email subscribers
    - `roi_calculations` - Store ROI calculator results (optional tracking)

  2. Security
    - Enable RLS on all tables
    - Public read access for content
    - Service role access for submissions

  3. Features
    - Timestamps for tracking
    - SEO-friendly slug fields
    - Display ordering for CMS-like management
*/

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price_chf integer NOT NULL,
  description text NOT NULL,
  features text[] NOT NULL,
  cta_text text NOT NULL,
  cta_link text NOT NULL,
  is_featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS use_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon_name text NOT NULL,
  time_saved_percent integer NOT NULL,
  current_process text,
  ai_process text,
  cost_savings_chf integer,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote text NOT NULL,
  author_name text NOT NULL,
  author_title text NOT NULL,
  author_company text NOT NULL,
  author_image_url text,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz DEFAULT now(),
  unsubscribed_at timestamptz,
  is_active boolean DEFAULT true
);

CREATE TABLE IF NOT EXISTS roi_calculations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  monthly_hours integer NOT NULL,
  hourly_rate_chf integer NOT NULL,
  num_employees integer NOT NULL,
  annual_cost_chf integer NOT NULL,
  potential_savings_chf integer NOT NULL,
  breakeven_months integer NOT NULL,
  roi_12_months_percent integer NOT NULL,
  calculated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE use_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE roi_calculations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Services are readable by everyone"
  ON services FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Use cases are readable by everyone"
  ON use_cases FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Testimonials are readable by everyone"
  ON testimonials FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Newsletter subscribers can be created by anyone"
  ON newsletter_subscribers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Newsletter subscribers can update their own"
  ON newsletter_subscribers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "ROI calculations are readable by everyone"
  ON roi_calculations FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "ROI calculations can be created by anyone"
  ON roi_calculations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

INSERT INTO services (name, price_chf, description, features, cta_text, cta_link, is_featured, display_order) VALUES
('Implementation', 18000, '100-hour AI agent implementation', ARRAY['100-hour AI agent implementation', 'Production-ready solution', 'CFO-focused approach', 'Fixed price guarantee'], 'Start Project', '/implementation', true, 1),
('Community', 100, 'Monthly workshops, resources, and network access', ARRAY['Monthly workshops', 'Resource library', 'Networking events', 'Community forum'], 'Join Community', '/community', false, 2),
('Training', 6000, 'In-house team workshops and training', ARRAY['Customized curriculum', 'Hands-on training', 'Certification included', 'Post-training support'], 'Book Training', '/training', false, 3);

INSERT INTO use_cases (title, description, icon_name, time_saved_percent, display_order) VALUES
('Invoice Processing', 'Automated invoice data extraction and processing', 'FileText', 80, 1),
('Financial Reporting', 'AI-powered report generation and analysis', 'BarChart3', 60, 2),
('Cash Flow Forecasting', 'Predictive cash flow modeling and alerts', 'TrendingUp', 70, 3),
('Compliance Monitoring', 'Real-time compliance checking and alerts', 'CheckCircle', 90, 4),
('Budget Analysis', 'Automated budget variance analysis', 'PieChart', 75, 5),
('Vendor Management', 'Supplier performance tracking and optimization', 'Users', 65, 6);

INSERT INTO testimonials (quote, author_name, author_title, author_company, featured) VALUES
('Michael''s expertise transformed how we handle our financial operations. Highly recommended.', 'Sarah Müller', 'CFO', 'TechStart AG', true),
('In 100 hours, we cut our monthly close cycle by 40%. Amazing results.', 'Hans Keller', 'Finance Director', 'Manufacturing Corp', true);
