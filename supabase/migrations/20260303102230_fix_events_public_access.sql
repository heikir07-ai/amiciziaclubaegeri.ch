/*
  # Fix Public Access to Events Table

  1. Changes
    - Drop existing policy
    - Create new policy that explicitly allows both authenticated and anonymous users to view events
    
  2. Security
    - Events remain publicly readable
    - No changes to write permissions
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Anyone can view events" ON events;

-- Create new policy with explicit roles
CREATE POLICY "Public can view events"
  ON events
  FOR SELECT
  TO anon, authenticated
  USING (true);
