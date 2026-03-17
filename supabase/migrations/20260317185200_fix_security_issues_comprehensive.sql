/*
  # Fix Security Issues

  This migration addresses multiple security and performance issues identified
  in the database audit.

  ## Changes
  
  ### Performance Improvements
  1. Add missing index for foreign key on event_registrations.event_id
  2. Remove unused indexes on membership_applications table
  
  ### RLS Policy Cleanup
  3. Remove duplicate policies for anon role on event_registrations
  4. Remove duplicate policies for anon role on events
  5. Drop orphaned RLS policies on tables where RLS is disabled
  
  ### Security Hardening
  6. Fix overly permissive policies on events table for authenticated users
     - Only allow authenticated users to manage events they created
     - Add created_by column to track ownership
*/

-- ============================================================================
-- 1. Add missing index for foreign key
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id 
ON event_registrations(event_id);

-- ============================================================================
-- 2. Remove unused indexes
-- ============================================================================

DROP INDEX IF EXISTS idx_membership_applications_status;
DROP INDEX IF EXISTS idx_membership_applications_created_at;

-- ============================================================================
-- 3. Remove duplicate policies on event_registrations
-- ============================================================================

-- Keep only the enable_insert_for_anon policy, drop enable_insert_for_all
DROP POLICY IF EXISTS "enable_insert_for_all" ON event_registrations;

-- ============================================================================
-- 4. Remove duplicate policies on events
-- ============================================================================

-- Keep "Public can view all events", drop allow_anon_select_events
DROP POLICY IF EXISTS "allow_anon_select_events" ON events;

-- ============================================================================
-- 5. Drop orphaned RLS policies on tables with RLS disabled
-- ============================================================================

-- Drop all policies on contact_messages (RLS is disabled)
DROP POLICY IF EXISTS "Anon users can send contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated users can view messages" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated users can update message status" ON contact_messages;

-- Drop remaining policies on event_registrations (RLS is disabled)
DROP POLICY IF EXISTS "enable_insert_for_anon" ON event_registrations;
DROP POLICY IF EXISTS "enable_read_for_authenticated" ON event_registrations;
DROP POLICY IF EXISTS "enable_update_for_authenticated" ON event_registrations;
DROP POLICY IF EXISTS "enable_delete_for_authenticated" ON event_registrations;

-- Drop all policies on membership_applications (RLS is disabled)
DROP POLICY IF EXISTS "Anon users can submit membership applications" ON membership_applications;
DROP POLICY IF EXISTS "Authenticated users can view applications" ON membership_applications;
DROP POLICY IF EXISTS "Authenticated users can update application status" ON membership_applications;

-- Drop all policies on newsletter_subscribers (RLS is disabled)
DROP POLICY IF EXISTS "Anon users can subscribe to newsletter" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Authenticated users can view subscribers" ON newsletter_subscribers;

-- ============================================================================
-- 6. Fix overly permissive policies on events table
-- ============================================================================

-- Add created_by column to track ownership
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'events' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE events ADD COLUMN created_by uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- Drop overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can insert events" ON events;
DROP POLICY IF EXISTS "Authenticated users can update events" ON events;
DROP POLICY IF EXISTS "Authenticated users can delete events" ON events;

-- Create ownership-based policies for authenticated users
CREATE POLICY "Authenticated users can insert own events"
ON events
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can update own events"
ON events
FOR UPDATE
TO authenticated
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can delete own events"
ON events
FOR DELETE
TO authenticated
USING (auth.uid() = created_by);

-- For existing events without created_by, set to NULL (admin will need to claim them)
UPDATE events SET created_by = NULL WHERE created_by IS NULL;
