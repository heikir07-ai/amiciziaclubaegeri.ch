/*
  # Create newsletter_subscribers table

  1. New Tables
    - `newsletter_subscribers`
      - `id` (uuid, primary key) - Unique identifier for each subscriber
      - `email` (text, unique, not null) - Subscriber's email address
      - `subscribed_at` (timestamptz) - When the subscription was created
      - `status` (text) - Subscription status (active, unsubscribed)

  2. Security
    - Enable RLS on `newsletter_subscribers` table
    - Add policy for anonymous users to insert their email (subscribe)
    - Add policy for authenticated users to read all subscribers
*/

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz DEFAULT now(),
  status text DEFAULT 'active'
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to subscribe
CREATE POLICY "Allow anonymous users to subscribe"
  ON newsletter_subscribers
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users to view all subscribers
CREATE POLICY "Authenticated users can view subscribers"
  ON newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (true);