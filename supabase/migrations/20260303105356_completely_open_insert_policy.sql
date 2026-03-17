/*
  # Create Completely Open INSERT Policy
  
  1. Changes
    - Drop all existing policies on event_registrations
    - Create a single, completely open INSERT policy
    - Recreate SELECT policy for authenticated users
  
  2. Security
    - Anyone can insert registrations (no restrictions)
    - Only authenticated users can view registrations
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow anon and authenticated to insert registrations" ON event_registrations;
DROP POLICY IF EXISTS "Authenticated users can view registrations" ON event_registrations;
DROP POLICY IF EXISTS "Anyone can register for events" ON event_registrations;

-- Create completely open INSERT policy (no role restriction)
CREATE POLICY "open_insert_policy"
  ON event_registrations
  FOR INSERT
  WITH CHECK (true);

-- Recreate SELECT policy for authenticated users
CREATE POLICY "authenticated_select_policy"
  ON event_registrations
  FOR SELECT
  TO authenticated
  USING (true);
