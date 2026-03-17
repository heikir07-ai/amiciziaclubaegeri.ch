/*
  # Add Anonymous SELECT Policy

  1. Changes
    - Add policy to allow anonymous users to view registrations
    - This allows confirmation messages after registration
  
  2. Security
    - Public can view all registrations (event registrations are public info)
    - Public can insert registrations
    - Authenticated users have full access
*/

-- Add SELECT policy for anonymous users
CREATE POLICY "public_select_access"
  ON event_registrations
  FOR SELECT
  TO public
  USING (true);
