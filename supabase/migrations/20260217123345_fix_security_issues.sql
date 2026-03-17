/*
  # Fix Security Issues

  ## Changes Made

  1. **Drop Unused Index**
    - Remove `idx_news_published` index on `news_posts.published_at` (unused)

  2. **Fix RLS Policies**
    - Update `newsletter_subscribers` UPDATE policy to restrict access to own records only
    - The INSERT policies with `WITH CHECK (true)` on public forms are intentional:
      - `contact_messages` - Public contact form
      - `membership_applications` - Public membership signup
      - `newsletter_subscribers` - Public newsletter signup
      - `roi_calculations` - Public calculator submissions
    - These forms are meant to accept anonymous submissions

  3. **Add Data Validation**
    - Add email format validation constraints
    - Add CHECK constraints to ensure data integrity
    - Add length constraints on text fields to prevent abuse

  ## Security Notes
  
  - Public submission forms intentionally allow anonymous inserts
  - Consider implementing rate limiting at the application/edge function level
  - Email validation ensures only valid email addresses are accepted
  - Text field length limits prevent potential DoS via large payloads
*/

-- 1. Drop unused index on news_posts
DROP INDEX IF EXISTS idx_news_published;

-- 2. Fix newsletter_subscribers UPDATE policy
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Newsletter subscribers can update their own" ON newsletter_subscribers;

-- Create a more restrictive policy that only allows users to update their own email record
CREATE POLICY "Users can update their own newsletter subscription"
  ON newsletter_subscribers FOR UPDATE
  TO authenticated
  USING (email = (SELECT auth.jwt()->>'email'))
  WITH CHECK (email = (SELECT auth.jwt()->>'email'));

-- 3. Add validation constraints for data integrity

-- Email validation for contact_messages
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'contact_messages_email_check'
  ) THEN
    ALTER TABLE contact_messages 
    ADD CONSTRAINT contact_messages_email_check 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
  END IF;
END $$;

-- Length constraints for contact_messages to prevent abuse
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'contact_messages_name_length'
  ) THEN
    ALTER TABLE contact_messages 
    ADD CONSTRAINT contact_messages_name_length 
    CHECK (length(name) <= 200);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'contact_messages_subject_length'
  ) THEN
    ALTER TABLE contact_messages 
    ADD CONSTRAINT contact_messages_subject_length 
    CHECK (length(subject) <= 500);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'contact_messages_message_length'
  ) THEN
    ALTER TABLE contact_messages 
    ADD CONSTRAINT contact_messages_message_length 
    CHECK (length(message) <= 10000);
  END IF;
END $$;

-- Email validation for membership_applications
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'membership_applications_email_check'
  ) THEN
    ALTER TABLE membership_applications 
    ADD CONSTRAINT membership_applications_email_check 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
  END IF;
END $$;

-- Length constraints for membership_applications
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'membership_applications_name_length'
  ) THEN
    ALTER TABLE membership_applications 
    ADD CONSTRAINT membership_applications_name_length 
    CHECK (length(full_name) <= 200);
  END IF;
END $$;

-- Email validation for newsletter_subscribers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'newsletter_subscribers_email_check'
  ) THEN
    ALTER TABLE newsletter_subscribers 
    ADD CONSTRAINT newsletter_subscribers_email_check 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
  END IF;
END $$;

-- Validation for ROI calculations to ensure realistic values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'roi_calculations_positive_values'
  ) THEN
    ALTER TABLE roi_calculations 
    ADD CONSTRAINT roi_calculations_positive_values 
    CHECK (
      monthly_hours > 0 AND monthly_hours <= 744 AND
      hourly_rate_chf > 0 AND hourly_rate_chf <= 10000 AND
      num_employees > 0 AND num_employees <= 100000
    );
  END IF;
END $$;
