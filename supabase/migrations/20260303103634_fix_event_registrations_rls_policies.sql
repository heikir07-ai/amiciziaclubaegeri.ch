/*
  # Fix Event Registrations RLS Policies

  1. Changes
    - Drop all existing policies on event_registrations table
    - Create new, simplified policies that actually work
    - Allow anonymous users to insert registrations (for public event registration)
    - Allow authenticated users to view all registrations (for admin purposes)

  2. Security
    - Public can register for events (anon role can INSERT)
    - Only authenticated users can view registrations (for privacy)
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Anyone can submit event registrations" ON event_registrations;
DROP POLICY IF EXISTS "Authenticated users can view event registrations" ON event_registrations;

-- Create new INSERT policy for anonymous and authenticated users
CREATE POLICY "Public can register for events"
  ON event_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create new SELECT policy for authenticated users only
CREATE POLICY "Admins can view registrations"
  ON event_registrations
  FOR SELECT
  TO authenticated
  USING (true);
