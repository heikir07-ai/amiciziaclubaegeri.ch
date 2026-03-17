/*
  # Fix RLS Policy for Anonymous Users

  1. Changes
    - Drop existing INSERT policy
    - Create new policy that explicitly allows both anon and authenticated roles
  
  2. Security
    - Allows anonymous users (anon role) to register for events
    - Allows authenticated users to register for events
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Anyone can register for events" ON event_registrations;

-- Create new policy with explicit roles
CREATE POLICY "Allow anon and authenticated to insert registrations"
  ON event_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
