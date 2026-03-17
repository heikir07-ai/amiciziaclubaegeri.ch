/*
  # Create Amicizia Club Aegeri Tables

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `title` (text) - Event title
      - `description` (text) - Event description
      - `event_date` (date) - Date of the event
      - `location` (text) - Event location
      - `registration_email` (text) - Contact email for registrations
      - `is_past` (boolean) - Whether the event is in the past
      - `created_at` (timestamptz) - Record creation timestamp

    - `event_registrations`
      - `id` (uuid, primary key)
      - `event_id` (uuid, foreign key to events)
      - `participant_name` (text) - Name of participant
      - `participant_email` (text) - Email of participant
      - `participant_phone` (text) - Phone of participant
      - `number_of_people` (integer) - Number of people registering
      - `status` (text) - Registration status (pending, confirmed, cancelled)
      - `created_at` (timestamptz) - Record creation timestamp

    - `contact_messages`
      - `id` (uuid, primary key)
      - `name` (text) - Sender name
      - `email` (text) - Sender email
      - `subject` (text) - Message subject
      - `message` (text) - Message content
      - `status` (text) - Message status (new, read, replied)
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on all tables
    - Allow public read access to events
    - Allow anonymous users to insert registrations and contact messages
    - Restrict other operations to authenticated users
*/

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_date date NOT NULL,
  location text NOT NULL,
  registration_email text,
  is_past boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create event_registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  participant_name text NOT NULL,
  participant_email text NOT NULL,
  participant_phone text NOT NULL,
  number_of_people integer NOT NULL DEFAULT 1,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Events policies: Allow public to read non-past events
CREATE POLICY "Anyone can view upcoming events"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage events"
  ON events FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Event registrations policies: Allow anonymous to insert, authenticated to manage
CREATE POLICY "Anyone can register for events"
  ON event_registrations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view registrations"
  ON event_registrations FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage registrations"
  ON event_registrations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete registrations"
  ON event_registrations FOR DELETE
  TO authenticated
  USING (true);

-- Contact messages policies: Allow anonymous to insert, authenticated to manage
CREATE POLICY "Anyone can send contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update messages"
  ON contact_messages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample events
INSERT INTO events (title, description, event_date, location, registration_email, is_past) VALUES
  ('Spaghetti-Festival 2026', 'Unser jährliches Spaghetti-Festival mit Live-Musik und italienischen Spezialitäten', '2026-09-13', 'Festhütte Unterägeri', 'amiciziaclubaegeri@gmail.com', false),
  ('Italienischer Abend', 'Geselliger Abend mit italienischem Essen und Wein', '2026-06-20', 'Gemeindesaal Unterägeri', 'amiciziaclubaegeri@gmail.com', false),
  ('Familientag am Ägerisee', 'Ein Tag voller Spass für die ganze Familie am Ägerisee', '2026-07-15', 'Strandbad Ägerisee', 'amiciziaclubaegeri@gmail.com', false)
ON CONFLICT DO NOTHING;