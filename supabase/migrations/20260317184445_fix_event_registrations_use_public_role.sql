/*
  # Fix Event Registrations RLS - Use PUBLIC Role

  The issue is that Supabase's anon key needs policies that apply to PUBLIC,
  not specifically to the anon role. PUBLIC includes both anon and authenticated.

  ## Changes
  1. Re-enable RLS
  2. Drop anon-specific policies
  3. Create policies using PUBLIC role
*/

-- Enable RLS
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "allow_anon_insert" ON event_registrations;
DROP POLICY IF EXISTS "allow_authenticated_all" ON event_registrations;

-- Create policy for PUBLIC (includes anon and authenticated)
CREATE POLICY "public_can_insert_registrations"
  ON event_registrations
  FOR INSERT
  WITH CHECK (true);

-- Authenticated users can do everything
CREATE POLICY "authenticated_can_manage_registrations"
  ON event_registrations
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
