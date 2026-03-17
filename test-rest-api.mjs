const SUPABASE_URL = 'https://lmusaiqixjiufxsynand.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtdXNhaXFpeGppdWZ4c3luYW5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNjM0MDAsImV4cCI6MjA3ODczOTQwMH0.sArypoe2Ptch9EZUaTggMBA3Y4bTJzFIX1DalgsKX94';

console.log('Testing REST API directly...\n');

async function testRestAPI() {
  try {
    // First, get an event
    console.log('Step 1: Fetching event...');
    const eventsResponse = await fetch(`${SUPABASE_URL}/rest/v1/events?select=*&limit=1`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      }
    });

    const events = await eventsResponse.json();
    console.log('Events Response:', events);

    if (!events || events.length === 0) {
      console.error('No events found');
      return;
    }

    const event = events[0];
    console.log('✅ Event found:', event.title);

    // Now try to insert a registration
    console.log('\nStep 2: Inserting registration via REST API...');
    const registrationData = {
      event_id: event.id,
      participant_name: 'REST API Test',
      participant_email: `resttest${Date.now()}@example.com`,
      participant_phone: '+41 79 888 88 88'
    };

    console.log('Data to insert:', registrationData);

    const insertResponse = await fetch(`${SUPABASE_URL}/rest/v1/event_registrations`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(registrationData)
    });

    console.log('Response Status:', insertResponse.status);
    console.log('Response Headers:', Object.fromEntries(insertResponse.headers));

    const responseText = await insertResponse.text();
    console.log('Response Body:', responseText);

    if (!insertResponse.ok) {
      console.error('❌ INSERT FAILED');
      try {
        const errorData = JSON.parse(responseText);
        console.error('Error details:', JSON.stringify(errorData, null, 2));
      } catch {
        console.error('Could not parse error response');
      }
      return;
    }

    const result = JSON.parse(responseText);
    console.log('✅ INSERT SUCCESSFUL!');
    console.log('Result:', JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('❌ Exception:', error.message);
    console.error('Stack:', error.stack);
  }
}

testRestAPI();
