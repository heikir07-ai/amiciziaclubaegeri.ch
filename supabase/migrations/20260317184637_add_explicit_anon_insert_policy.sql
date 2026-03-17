/*
  # Add Explicit Anon Insert Policy

  The issue is that the anon role is not included in the PUBLIC role
  for RLS policy evaluation. We need an explicit policy FOR anon.

  ## Changes
  1. Add explicit INSERT policy TO anon
  2. Keep existing policies intact
*/

-- Add explicit policy for anon role
CREATE POLICY "enable_insert_for_anon"
ON event_registrations
FOR INSERT
TO anon
WITH CHECK (true);
