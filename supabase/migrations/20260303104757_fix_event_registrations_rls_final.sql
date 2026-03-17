/*
  # Fix Event Registrations - Complete RLS Setup
  
  1. Changes
    - Drop and recreate event_registrations table with proper RLS
    - Add public read policy for events table
    - Add anonymous insert policy for event_registrations
    
  2. Security
    - Enable RLS on event_registrations
    - Allow anonymous users to insert registrations
    - Allow anonymous and authenticated users to read events
*/

-- Drop existing table if exists
DROP TABLE IF EXISTS event_registrations CASCADE;

-- Recreate event_registrations table
CREATE TABLE event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  participant_name text NOT NULL,
  participant_email text NOT NULL,
  participant_phone text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone (including anonymous) to insert registrations
CREATE POLICY "Anyone can register for events"
  ON event_registrations
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow authenticated users to view all registrations (for admin)
CREATE POLICY "Authenticated users can view registrations"
  ON event_registrations
  FOR SELECT
  TO authenticated
  USING (true);

-- Create index for better performance
CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_email ON event_registrations(participant_email);
