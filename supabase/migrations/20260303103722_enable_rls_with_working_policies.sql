/*
  # Enable RLS with Working Policies for Event Registrations

  1. Changes
    - Re-enable RLS on event_registrations
    - Drop all existing policies
    - Create a single permissive INSERT policy that definitely works
    - Create a simple SELECT policy for authenticated users

  2. Security
    - Public users (anon) can insert event registrations
    - Authenticated users can view all registrations
    
  3. Notes
    - Using simplified policy syntax
    - Ensuring no restrictive policies interfere
*/

-- Re-enable RLS
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Public can register for events" ON event_registrations;
DROP POLICY IF EXISTS "Admins can view registrations" ON event_registrations;
DROP POLICY IF EXISTS "Anyone can submit event registrations" ON event_registrations;
DROP POLICY IF EXISTS "Authenticated users can view event registrations" ON event_registrations;

-- Create INSERT policy that allows anyone (anon + authenticated) to register
CREATE POLICY "enable_insert_for_anon_users"
ON event_registrations
FOR INSERT
WITH CHECK (true);

-- Create SELECT policy for authenticated users
CREATE POLICY "enable_read_for_authenticated_users"
ON event_registrations
FOR SELECT
TO authenticated
USING (true);
