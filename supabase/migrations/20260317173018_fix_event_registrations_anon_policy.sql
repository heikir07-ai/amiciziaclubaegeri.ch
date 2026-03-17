/*
  # Fix Event Registrations RLS Policy for Anonymous Role

  1. Changes
    - Drop existing policies that don't work for anon role
    - Create new INSERT policy specifically for anon role
    - Validate that name and email are non-empty

  2. Security
    - Anonymous users can insert registrations with valid name and email
*/

DROP POLICY IF EXISTS "public_all_access" ON event_registrations;
DROP POLICY IF EXISTS "Anyone can register for events" ON event_registrations;
DROP POLICY IF EXISTS "Anyone can register for upcoming events" ON event_registrations;
DROP POLICY IF EXISTS "Allow anonymous event registrations" ON event_registrations;

CREATE POLICY "anon_insert_event_registrations" 
  ON event_registrations 
  FOR INSERT 
  TO anon 
  WITH CHECK (
    participant_name IS NOT NULL 
    AND participant_name != '' 
    AND participant_email IS NOT NULL 
    AND participant_email != ''
  );
