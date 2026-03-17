/*
  # Fix Anonymous User Insert Policy

  1. Changes
    - Drop existing INSERT policy
    - Create new policy explicitly for anon and authenticated roles
    - Use TO clause to explicitly specify roles

  2. Security
    - Explicitly grant INSERT permission to anon role
    - Also grant to authenticated for logged-in users
*/

-- Drop existing INSERT policy
DROP POLICY IF EXISTS "enable_insert_for_anon_users" ON event_registrations;

-- Create INSERT policy with explicit role specification
CREATE POLICY "allow_anon_insert_registrations"
ON event_registrations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
