/*
  # Disable and Re-enable RLS with Correct Configuration
  
  1. Changes
    - Disable RLS temporarily
    - Drop all policies
    - Re-enable RLS
    - Create new, working policies
  
  2. Security
    - Anyone can insert registrations
    - Authenticated users can view registrations
*/

-- Disable RLS
ALTER TABLE event_registrations DISABLE ROW LEVEL SECURITY;

-- Drop all policies
DROP POLICY IF EXISTS "open_insert_policy" ON event_registrations;
DROP POLICY IF EXISTS "authenticated_select_policy" ON event_registrations;
DROP POLICY IF EXISTS "Allow anon and authenticated to insert registrations" ON event_registrations;
DROP POLICY IF EXISTS "Authenticated users can view registrations" ON event_registrations;
DROP POLICY IF EXISTS "Anyone can register for events" ON event_registrations;

-- Re-enable RLS
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Create INSERT policy - explicitly for all roles
CREATE POLICY "enable_insert_for_all"
  ON event_registrations
  FOR INSERT
  TO public, anon, authenticated
  WITH CHECK (true);

-- Create SELECT policy for authenticated users
CREATE POLICY "enable_select_for_authenticated"
  ON event_registrations
  FOR SELECT
  TO authenticated
  USING (true);
