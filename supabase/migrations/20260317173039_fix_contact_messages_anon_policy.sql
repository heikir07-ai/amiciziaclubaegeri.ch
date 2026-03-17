/*
  # Fix Contact Messages RLS Policy for Anonymous Role

  1. Changes
    - Drop existing policies that don't work for anon role
    - Create new INSERT policy specifically for anon role
    - Validate that name, email, and message are non-empty

  2. Security
    - Anonymous users can insert contact messages with valid data
*/

DROP POLICY IF EXISTS "Anyone can submit contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Anyone can send contact messages" ON contact_messages;

CREATE POLICY "anon_insert_contact_messages" 
  ON contact_messages 
  FOR INSERT 
  TO anon 
  WITH CHECK (
    name IS NOT NULL 
    AND name != '' 
    AND email IS NOT NULL 
    AND email != '' 
    AND message IS NOT NULL 
    AND message != ''
  );
