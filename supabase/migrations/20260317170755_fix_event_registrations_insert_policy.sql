/*
  # Fix event_registrations INSERT policy

  1. Changes
    - Drop the existing "Anyone can insert event registrations" policy
    - Create a new simpler policy that allows anonymous users to insert registrations
    - The policy should only apply to INSERT operations, not ALL operations

  2. Security
    - Anonymous users can register for events (INSERT)
    - Authenticated users can view, update, and delete registrations
*/

-- Drop the old policy
DROP POLICY IF EXISTS "Anyone can insert event registrations" ON event_registrations;

-- Create a simple policy that allows anyone (including anonymous) to insert event registrations
CREATE POLICY "Allow anonymous event registrations"
  ON event_registrations
  FOR INSERT
  WITH CHECK (true);