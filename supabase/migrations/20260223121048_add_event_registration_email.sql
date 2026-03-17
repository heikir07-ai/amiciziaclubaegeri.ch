/*
  # Add Event Registration Email Field
  
  ## Summary
  Adds optional registration_email field to events table for flexible event registration handling.
  
  ## Changes Made
  
  1. **New Column**
     - Add `registration_email` column to `events` table
     - Defaults to amiciziaclubaegeri@gmail.com if not specified
     - Allows each event to have a custom registration contact email
  
  ## Notes
  - This enables flexible event registration management
  - Falls back to the club's main email if not specified
*/

-- Add registration_email column to events table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'registration_email'
  ) THEN
    ALTER TABLE events 
    ADD COLUMN registration_email text DEFAULT 'amiciziaclubaegeri@gmail.com';
    
    -- Add email validation
    ALTER TABLE events 
    ADD CONSTRAINT events_registration_email_check 
    CHECK (registration_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
  END IF;
END $$;