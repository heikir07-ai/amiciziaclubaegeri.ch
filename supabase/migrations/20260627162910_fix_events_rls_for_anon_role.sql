/*
# Fix Events RLS for anon role

The website is a no-auth app using the anon Supabase key. The current SELECT policy
on `events` is scoped TO public, but the frontend client runs as the `anon` role.
This causes the events table to appear empty in the app even though rows exist.

Changes:
- Drop the existing public-only SELECT policy on events.
- Recreate it for `anon, authenticated` so the anon-key frontend can read events.
*/

DROP POLICY IF EXISTS "Public can view all events" ON events;

CREATE POLICY "anon_can_select_events"
ON events FOR SELECT
TO anon, authenticated
USING (true);
