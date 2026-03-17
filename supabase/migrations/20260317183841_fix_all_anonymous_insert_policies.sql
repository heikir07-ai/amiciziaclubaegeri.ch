/*
  # Fix All Anonymous Insert Policies

  This migration fixes the RLS policies on all public-facing tables to properly
  allow anonymous users to submit forms.

  ## Changes
  - Update contact_messages INSERT policy to use public role
  - Update newsletter_subscribers INSERT policy to use public role
  - Update membership_applications INSERT policy to use public role
*/

-- Fix contact_messages
DROP POLICY IF EXISTS "Anon can send messages" ON contact_messages;
CREATE POLICY "Allow anonymous contact messages"
  ON contact_messages
  FOR INSERT
  WITH CHECK (true);

-- Fix newsletter_subscribers
DROP POLICY IF EXISTS "Anon can subscribe" ON newsletter_subscribers;
CREATE POLICY "Allow anonymous newsletter subscription"
  ON newsletter_subscribers
  FOR INSERT
  WITH CHECK (true);

-- Fix membership_applications
DROP POLICY IF EXISTS "Anon can apply" ON membership_applications;
CREATE POLICY "Allow anonymous membership applications"
  ON membership_applications
  FOR INSERT
  WITH CHECK (true);
