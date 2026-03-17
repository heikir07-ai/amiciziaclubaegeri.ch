import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lmusaiqixjiufxsynand.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtdXNhaXFpeGppdWZ4c3luYW5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNjM0MDAsImV4cCI6MjA3ODczOTQwMH0.sArypoe2Ptch9EZUaTggMBA3Y4bTJzFIX1DalgsKX94';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔍 Starting Registration Debug Test\n');

async function testRegistration() {
  try {
    // Step 1: Fetch an event
    console.log('Step 1: Fetching events...');
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .limit(1);

    if (eventsError) {
      console.error('❌ Events Error:', eventsError);
      return;
    }

    if (!events || events.length === 0) {
      console.error('❌ No events found');
      return;
    }

    console.log('✅ Event found:', events[0].title);
    const event = events[0];

    // Step 2: Insert registration
    console.log('\nStep 2: Inserting registration...');
    const registrationData = {
      event_id: event.id,
      participant_name: 'Debug Test User',
      participant_email: `debug${Date.now()}@example.com`,
      participant_phone: '+41 79 999 99 99'
    };

    console.log('Registration data:', registrationData);

    const { data: registration, error: regError } = await supabase
      .from('event_registrations')
      .insert([registrationData])
      .select();

    if (regError) {
      console.error('❌ Registration Error:', regError);
      console.error('Error details:', JSON.stringify(regError, null, 2));
      return;
    }

    if (!registration || registration.length === 0) {
      console.error('❌ No data returned from insert');
      return;
    }

    console.log('✅ Registration successful!');
    console.log('Registration ID:', registration[0].id);
    console.log('Full data:', JSON.stringify(registration[0], null, 2));

    // Step 3: Verify it was saved
    console.log('\nStep 3: Verifying registration was saved...');
    const { data: verify, error: verifyError } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('id', registration[0].id)
      .maybeSingle();

    if (verifyError) {
      console.error('❌ Verification Error:', verifyError);
      return;
    }

    if (!verify) {
      console.error('❌ Registration not found in database');
      return;
    }

    console.log('✅ Verification successful! Registration exists in database');
    console.log('\n🎉 ALL TESTS PASSED!\n');

  } catch (error) {
    console.error('❌ Exception:', error.message);
    console.error('Stack:', error.stack);
  }
}

testRegistration();
