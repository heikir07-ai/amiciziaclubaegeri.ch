/*
  # Ultimate Fix - Make Event Registrations Publicly Writable

  After extensive debugging, the simplest solution is to create
  a policy without any role restrictions that allows anyone to insert.

  ## Changes
  1. Drop existing policies
  2. Create a single permissive INSERT policy with no TO clause
  3. Ensure table-level grants exist for anon and public
*/

-- Drop all policies
DROP POLICY IF EXISTS "anyone_can_insert_registrations" ON event_registrations;
DROP POLICY IF EXISTS "authenticated_can_do_everything" ON event_registrations;

-- Make absolutely sure grants exist
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT, SELECT ON TABLE event_registrations TO anon, authenticated;

-- Create the most permissive INSERT policy possible
CREATE POLICY "enable_insert_for_all"
ON event_registrations
FOR INSERT
WITH CHECK (true);

-- Separate policies for authenticated users to manage
CREATE POLICY "enable_read_for_authenticated"
ON event_registrations
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "enable_update_for_authenticated"
ON event_registrations
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "enable_delete_for_authenticated"
ON event_registrations
FOR DELETE
TO authenticated
USING (true);
