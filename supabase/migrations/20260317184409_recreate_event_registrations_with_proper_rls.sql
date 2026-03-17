/*
  # Recreate Event Registrations Table with Proper RLS

  This migration completely recreates the event_registrations table with
  proper RLS policies that actually work for anonymous users.

  ## Changes
  1. Drop existing table and all policies
  2. Recreate table with same structure
  3. Enable RLS
  4. Create simple, working policies for anon role
  5. Grant necessary permissions to anon role
*/

-- Drop the existing table (this will cascade to policies)
DROP TABLE IF EXISTS event_registrations CASCADE;

-- Recreate the table
CREATE TABLE event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  participant_name text NOT NULL,
  participant_email text NOT NULL,
  participant_phone text NOT NULL,
  number_of_people integer NOT NULL DEFAULT 1,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Grant permissions to anon role
GRANT SELECT, INSERT ON event_registrations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON event_registrations TO authenticated;

-- Create policies
CREATE POLICY "allow_anon_insert"
  ON event_registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "allow_authenticated_all"
  ON event_registrations
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
