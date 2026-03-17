/*
  # Fix Remaining Security Issues
  
  ## Summary
  This migration addresses security warnings and optimizes database performance.
  
  ## Changes Made
  
  1. **Remove Unused Indexes**
     - Drop `idx_events_date` on `events` table (not being used)
     - Drop `idx_committee_order` on `committee_members` table (not being used)
  
  2. **Optimize RLS Policy Performance**
     - Update newsletter_subscribers UPDATE policy to use subquery pattern
     - This prevents re-evaluation of auth functions for each row
  
  3. **Public Form Policies (Intentional "Always True")**
     The following policies intentionally allow anonymous submissions and are secure by design:
     - `contact_messages` - INSERT: Public contact form submissions
     - `membership_applications` - INSERT: Public membership signup
     - `newsletter_subscribers` - INSERT: Public newsletter signup  
     - `roi_calculations` - INSERT: Public calculator submissions
     
     These tables:
     - Only allow INSERT operations for anonymous users (no UPDATE/DELETE)
     - Have validation constraints (email format, length limits)
     - Are designed for public data collection
     - Should implement rate limiting at application/edge function level
  
  ## Notes
  - Auth DB Connection Strategy must be changed in Supabase Dashboard (cannot be set via SQL)
  - Consider implementing rate limiting for public forms at the edge function level
*/

-- 1. Drop unused indexes
DROP INDEX IF EXISTS idx_events_date;
DROP INDEX IF EXISTS idx_committee_order;

-- 2. Optimize newsletter_subscribers UPDATE policy for better performance
-- Drop the existing policy first
DROP POLICY IF EXISTS "Users can update their own newsletter subscription" ON newsletter_subscribers;

-- Recreate with optimized subquery pattern to prevent row-by-row re-evaluation
CREATE POLICY "Users can update their own newsletter subscription"
  ON newsletter_subscribers FOR UPDATE
  TO authenticated
  USING (email = (SELECT (auth.jwt()->>'email')))
  WITH CHECK (email = (SELECT (auth.jwt()->>'email')));

-- 3. Add indexes for better query performance on public forms
-- These help with duplicate checking and data retrieval
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_membership_created ON membership_applications(created_at DESC);

-- 4. Add a comment documenting why "always true" policies are acceptable here
COMMENT ON POLICY "Newsletter subscribers can be created by anyone" ON newsletter_subscribers IS 
'Public newsletter signup form - intentionally allows anonymous submissions. Rate limiting should be implemented at application level.';

COMMENT ON POLICY "ROI calculations can be created by anyone" ON roi_calculations IS 
'Public ROI calculator - intentionally allows anonymous submissions for lead generation. Rate limiting should be implemented at application level.';