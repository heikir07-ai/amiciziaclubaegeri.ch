/*
  # Fix Membership Applications RLS Policy for Anonymous Role

  1. Changes
    - Drop existing policies that don't work for anon role
    - Create new INSERT policy specifically for anon role
    - Validate that full_name and email are non-empty

  2. Security
    - Anonymous users can submit membership applications with valid data
*/

DROP POLICY IF EXISTS "Anyone can apply for membership" ON membership_applications;
DROP POLICY IF EXISTS "Anyone can submit membership applications" ON membership_applications;

CREATE POLICY "anon_insert_membership" 
  ON membership_applications 
  FOR INSERT 
  TO anon 
  WITH CHECK (
    full_name IS NOT NULL 
    AND full_name != '' 
    AND email IS NOT NULL 
    AND email != ''
  );
