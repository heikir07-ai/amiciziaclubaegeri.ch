/*
  # Fix Newsletter Subscribers RLS Policy for Anonymous Role

  1. Changes
    - Drop existing policies that don't work for anon role
    - Create new INSERT policy specifically for anon role
    - Validate that email is non-empty

  2. Security
    - Anonymous users can subscribe to newsletter with valid email
*/

DROP POLICY IF EXISTS "Anyone can subscribe" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow anonymous users to subscribe" ON newsletter_subscribers;

CREATE POLICY "anon_insert_newsletter" 
  ON newsletter_subscribers 
  FOR INSERT 
  TO anon 
  WITH CHECK (
    email IS NOT NULL 
    AND email != ''
  );
