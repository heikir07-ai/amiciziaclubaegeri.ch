/*
  # Add Email Sending Triggers

  1. New Tables
    - `event_registrations` - Stores event registration data
      - `id` (uuid, primary key)
      - `event_id` (uuid, foreign key to events)
      - `participant_name` (text)
      - `participant_email` (text)
      - `participant_phone` (text, optional)
      - `status` (text, default 'pending')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `event_registrations` table
    - Add policy for anyone to submit event registrations
    - Add policy for authenticated users to view registrations

  3. Triggers
    - Add trigger to send email when contact message is created
    - Add trigger to send email when event registration is created
*/

-- Create event_registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  participant_name text NOT NULL CHECK (length(participant_name) <= 200),
  participant_email text NOT NULL CHECK (participant_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  participant_phone text CHECK (length(participant_phone) <= 50),
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Policies for event_registrations
CREATE POLICY "Anyone can submit event registrations"
  ON event_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view event registrations"
  ON event_registrations
  FOR SELECT
  TO authenticated
  USING (true);

-- Trigger function for contact messages
CREATE OR REPLACE FUNCTION notify_contact_message()
RETURNS TRIGGER AS $$
DECLARE
  function_url text;
  api_key text;
BEGIN
  function_url := current_setting('app.settings.supabase_url', true) || '/functions/v1/send-contact-email';
  api_key := current_setting('app.settings.supabase_anon_key', true);

  IF function_url IS NOT NULL AND api_key IS NOT NULL THEN
    PERFORM net.http_post(
      url := function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || api_key
      ),
      body := jsonb_build_object(
        'name', NEW.name,
        'email', NEW.email,
        'subject', NEW.subject,
        'message', NEW.message
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function for event registrations
CREATE OR REPLACE FUNCTION notify_event_registration()
RETURNS TRIGGER AS $$
DECLARE
  function_url text;
  api_key text;
  event_record RECORD;
BEGIN
  SELECT title, event_date, location, registration_email
  INTO event_record
  FROM events
  WHERE id = NEW.event_id;

  function_url := current_setting('app.settings.supabase_url', true) || '/functions/v1/send-event-email';
  api_key := current_setting('app.settings.supabase_anon_key', true);

  IF function_url IS NOT NULL AND api_key IS NOT NULL THEN
    PERFORM net.http_post(
      url := function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || api_key
      ),
      body := jsonb_build_object(
        'eventTitle', event_record.title,
        'participantName', NEW.participant_name,
        'participantEmail', NEW.participant_email,
        'participantPhone', NEW.participant_phone,
        'registrationEmail', event_record.registration_email,
        'eventDate', event_record.event_date,
        'eventLocation', event_record.location
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
DROP TRIGGER IF EXISTS on_contact_message_created ON contact_messages;
CREATE TRIGGER on_contact_message_created
  AFTER INSERT ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_contact_message();

DROP TRIGGER IF EXISTS on_event_registration_created ON event_registrations;
CREATE TRIGGER on_event_registration_created
  AFTER INSERT ON event_registrations
  FOR EACH ROW
  EXECUTE FUNCTION notify_event_registration();
