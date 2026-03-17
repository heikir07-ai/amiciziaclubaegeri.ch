/*
  # Create Membership Applications Table

  1. New Tables
    - `membership_applications`
      - `id` (uuid, primary key)
      - `full_name` (text, required) - Applicant's full name
      - `email` (text, required) - Applicant's email address
      - `membership_type` (text, required) - Type: 'single' or 'family'
      - `message` (text, optional) - Additional message from applicant
      - `status` (text, default 'new') - Status: 'new', 'approved', 'rejected'
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `membership_applications` table
    - Allow anonymous users to INSERT applications (public contact form requirement)
    - Allow authenticated users to view all applications
    - Allow authenticated users to update application status

  3. Indexes
    - Add index on email for lookups
    - Add index on status for filtering
*/

-- Create membership_applications table
CREATE TABLE IF NOT EXISTS membership_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  membership_type text NOT NULL CHECK (membership_type IN ('single', 'family')),
  message text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE membership_applications ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to submit applications
CREATE POLICY "Anyone can submit membership applications"
  ON membership_applications FOR INSERT
  WITH CHECK (
    full_name IS NOT NULL 
    AND email IS NOT NULL 
    AND membership_type IS NOT NULL
    AND length(full_name) >= 2
    AND length(email) >= 5
  );

-- Authenticated users can view all applications
CREATE POLICY "Authenticated users can view all applications"
  ON membership_applications FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can update application status
CREATE POLICY "Authenticated users can update application status"
  ON membership_applications FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (status IN ('new', 'approved', 'rejected'));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_membership_applications_email 
  ON membership_applications(email);

CREATE INDEX IF NOT EXISTS idx_membership_applications_status 
  ON membership_applications(status);

CREATE INDEX IF NOT EXISTS idx_membership_applications_created_at 
  ON membership_applications(created_at DESC);
