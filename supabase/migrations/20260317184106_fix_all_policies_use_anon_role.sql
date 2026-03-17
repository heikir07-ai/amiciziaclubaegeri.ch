/*
  # Fix All Anonymous Insert Policies to Use Anon Role

  The issue is that policies were created for the 'public' role, but Supabase's
  anon key actually authenticates as the 'anon' role. We need to recreate all
  INSERT policies to use the correct 'anon' role.

  ## Changes
  - Drop all existing 'public' role policies
  - Create new policies specifically for 'anon' role
  - Apply to all 4 tables: event_registrations, contact_messages, newsletter_subscribers, membership_applications
*/

-- Drop old public policies
DROP POLICY IF EXISTS "Allow anonymous event registration" ON event_registrations;
DROP POLICY IF EXISTS "Allow anonymous contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Allow anonymous newsletter subscription" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow anonymous membership applications" ON membership_applications;

-- Create new anon role policies for event_registrations
CREATE POLICY "Anon users can register for events"
  ON event_registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create new anon role policies for contact_messages
CREATE POLICY "Anon users can send contact messages"
  ON contact_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create new anon role policies for newsletter_subscribers
CREATE POLICY "Anon users can subscribe to newsletter"
  ON newsletter_subscribers
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create new anon role policies for membership_applications
CREATE POLICY "Anon users can submit membership applications"
  ON membership_applications
  FOR INSERT
  TO anon
  WITH CHECK (true);
