/*
  # Fix Event Registrations Policy - Remove TO Clause

  1. Changes
    - Drop existing INSERT policy
    - Create new policy WITHOUT TO clause (like working contact_messages table)
    - This allows ALL roles including anon to insert

  2. Security
    - Public can register for events
    - RLS is still enabled for protection
*/

-- Drop existing INSERT policy
DROP POLICY IF EXISTS "allow_anon_insert_registrations" ON event_registrations;

-- Create INSERT policy WITHOUT TO clause (like contact_messages)
CREATE POLICY "Anyone can submit event registrations"
ON event_registrations
FOR INSERT
WITH CHECK (true);
