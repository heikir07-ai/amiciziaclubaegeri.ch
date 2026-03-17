/*
  # Remove Email Triggers

  This migration removes the database triggers for email sending.
  Email sending will be handled directly from the frontend instead.

  1. Changes
    - Drop triggers for contact messages and event registrations
    - Drop trigger functions
*/

-- Drop triggers
DROP TRIGGER IF EXISTS on_contact_message_created ON contact_messages;
DROP TRIGGER IF EXISTS on_event_registration_created ON event_registrations;

-- Drop trigger functions
DROP FUNCTION IF EXISTS notify_contact_message();
DROP FUNCTION IF EXISTS notify_event_registration();
