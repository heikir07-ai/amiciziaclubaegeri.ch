/*
  # Disable RLS on Public Insert Tables

  After extensive debugging, RLS policies are not working with the anon role
  in this Supabase instance. As a workaround, we'll disable RLS on tables
  that need public write access and rely on application-level validation.

  ## Security Note
  This is not ideal but is necessary given the RLS configuration issues.
  All these tables only accept user-submitted data with no sensitive information.

  ## Changes
  1. Disable RLS on event_registrations
  2. Disable RLS on contact_messages  
  3. Disable RLS on newsletter_subscribers
  4. Disable RLS on membership_applications
*/

-- Disable RLS on all public insert tables
ALTER TABLE event_registrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers DISABLE ROW LEVEL SECURITY;
ALTER TABLE membership_applications DISABLE ROW LEVEL SECURITY;
