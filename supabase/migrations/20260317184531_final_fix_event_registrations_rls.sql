/*
  # Final Fix for Event Registrations RLS

  The issue is we need both:
  1. Table-level GRANT permissions for the role
  2. Row-level security policies
  
  Since anon inherits from public, we'll grant to both and ensure
  the policy applies to all roles.

  ## Changes
  1. Drop all existing policies
  2. Grant INSERT/SELECT to anon, authenticated, and public
  3. Create simple policies that work
*/

-- Drop all policies
DROP POLICY IF EXISTS "public_can_insert_registrations" ON event_registrations;
DROP POLICY IF EXISTS "authenticated_can_manage_registrations" ON event_registrations;

-- Ensure all necessary grants exist
GRANT SELECT, INSERT ON event_registrations TO anon;
GRANT SELECT, INSERT ON event_registrations TO public;
GRANT ALL ON event_registrations TO authenticated;

-- Create policies without TO clause (applies to all roles)
CREATE POLICY "anyone_can_insert_registrations"
  ON event_registrations
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "authenticated_can_do_everything"
  ON event_registrations
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
