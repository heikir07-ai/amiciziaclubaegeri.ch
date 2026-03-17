import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lmusaiqixjiufxsynand.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtdXNhaXFpeGppdWZ4c3luYW5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNjM0MDAsImV4cCI6MjA3ODczOTQwMH0.sArypoe2Ptch9EZUaTggMBA3Y4bTJzFIX1DalgsKX94';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🧪 Testing Event Registration...\n');

async function testRegistration() {
  try {
    // Step 1: Get an event
    console.log('Step 1: Fetching events...');
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .limit(1);

    if (eventsError) {
      console.error('❌ Error fetching events:', eventsError);
      return;
    }

    if (!events || events.length === 0) {
      console.error('❌ No events found');
      return;
    }

    console.log('✅ Event found:', events[0].title);
    console.log('   Event ID:', events[0].id);

    // Step 2: Try to insert a registration
    console.log('\nStep 2: Inserting registration...');
    const registrationData = {
      event_id: events[0].id,
      participant_name: 'Test User',
      participant_email: 'test@example.com',
      participant_phone: '+41 79 123 45 67',
    };

    console.log('Registration data:', registrationData);

    const { data, error } = await supabase
      .from('event_registrations')
      .insert(registrationData)
      .select();

    if (error) {
      console.error('❌ Registration error:', error);
      console.error('   Code:', error.code);
      console.error('   Message:', error.message);
      console.error('   Details:', error.details);
      console.error('   Hint:', error.hint);
      return;
    }

    console.log('✅ Registration successful!');
    console.log('   Data:', data);

    // Step 3: Verify it was saved
    console.log('\nStep 3: Verifying registration was saved...');
    const { data: saved, error: selectError } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('participant_email', 'test@example.com')
      .single();

    if (selectError) {
      console.log('⚠️  Could not verify (might be RLS policy for SELECT)');
      console.log('   This is OK if only authenticated users can view registrations');
    } else {
      console.log('✅ Registration verified:', saved);
    }

  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

testRegistration();
