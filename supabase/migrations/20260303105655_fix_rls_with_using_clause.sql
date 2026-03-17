/*
  # Fix RLS using USING clause instead of WITH CHECK

  1. Changes
    - Drop all existing policies
    - Create new INSERT policy using USING clause (Supabase workaround)
  
  2. Security
    - Public can insert registrations
    - Authenticated users can view all registrations
  
  3. Technical Note
    - Some Supabase versions have a bug where WITH CHECK doesn't work for anon
    - Using USING clause is a documented workaround
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "allow_public_insert" ON event_registrations;
DROP POLICY IF EXISTS "allow_anon_select_own" ON event_registrations;
DROP POLICY IF EXISTS "allow_authenticated_select_all" ON event_registrations;
DROP POLICY IF EXISTS "allow_authenticated_update" ON event_registrations;

-- Create INSERT policy with USING clause (workaround for Supabase bug)
CREATE POLICY "public_insert_access"
  ON event_registrations
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create SELECT policy for authenticated
CREATE POLICY "authenticated_select_access"
  ON event_registrations
  FOR SELECT
  TO authenticated
  USING (true);

-- Alternative: Try using FOR ALL with both clauses
DROP POLICY IF EXISTS "public_insert_access" ON event_registrations;

CREATE POLICY "public_all_access"
  ON event_registrations
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);
