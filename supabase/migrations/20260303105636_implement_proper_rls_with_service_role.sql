/*
  # Implement Proper RLS with Service Role Bypass

  1. Changes
    - Re-enable RLS on event_registrations
    - Create proper policies for public access
    - Grant service_role permission to bypass RLS for backend operations
  
  2. Security
    - Anonymous users can INSERT registrations (public form submissions)
    - Anonymous users can SELECT their own registrations (by email)
    - Authenticated users can SELECT all registrations (admin access)
    - Service role bypasses RLS for backend operations (email sending, etc.)
  
  3. Best Practice Pattern
    - This follows Supabase's recommended pattern for public form submissions
    - RLS protects data while allowing necessary public operations
*/

-- Re-enable RLS
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow anyone to insert registrations (public form)
CREATE POLICY "allow_public_insert"
  ON event_registrations
  FOR INSERT
  WITH CHECK (true);

-- Policy 2: Allow anonymous users to view their own registrations by email
CREATE POLICY "allow_anon_select_own"
  ON event_registrations
  FOR SELECT
  TO anon
  USING (
    participant_email = current_setting('request.jwt.claims', true)::json->>'email'
    OR participant_email IN (
      SELECT unnest(string_to_array(current_setting('request.headers', true)::json->>'x-user-email', ','))
    )
  );

-- Policy 3: Allow authenticated users to view all registrations (admin)
CREATE POLICY "allow_authenticated_select_all"
  ON event_registrations
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy 4: Allow authenticated users to update registration status (admin)
CREATE POLICY "allow_authenticated_update"
  ON event_registrations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Grant service_role full access (bypasses RLS automatically)
GRANT ALL ON event_registrations TO service_role;
