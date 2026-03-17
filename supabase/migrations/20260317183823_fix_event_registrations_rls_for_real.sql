/*
  # Fix Event Registrations RLS to Allow Anonymous Inserts

  This migration fixes the RLS policy on event_registrations to properly allow
  anonymous users to register for events.

  ## Changes
  - Drop and recreate the INSERT policy with proper permissions
  - Ensure the anon role can insert without authentication
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Anon can register for events" ON event_registrations;

-- Create a new policy that allows anyone to insert
CREATE POLICY "Allow anonymous event registration"
  ON event_registrations
  FOR INSERT
  WITH CHECK (true);
