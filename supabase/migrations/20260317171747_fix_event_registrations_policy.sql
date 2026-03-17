/*
  # Fix Event Registrations RLS Policy

  1. Changes
    - Update event_registrations INSERT policy to only allow registrations for upcoming events
    - This prevents registrations for past events

  2. Security
    - Anonymous users can only register for events with event_date >= CURRENT_DATE
*/

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Allow anonymous event registrations" ON event_registrations;

-- Create a more restrictive policy
CREATE POLICY "Anyone can register for upcoming events"
  ON event_registrations FOR INSERT
  WITH CHECK (
    event_id IN (SELECT id FROM events WHERE event_date >= CURRENT_DATE)
  );
