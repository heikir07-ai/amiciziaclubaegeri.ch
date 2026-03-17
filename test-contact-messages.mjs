const SUPABASE_URL = 'https://lmusaiqixjiufxsynand.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtdXNhaXFpeGppdWZ4c3luYW5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNjM0MDAsImV4cCI6MjA3ODczOTQwMH0.sArypoe2Ptch9EZUaTggMBA3Y4bTJzFIX1DalgsKX94';

console.log('Testing contact_messages table (known working)...\n');

async function testContactMessages() {
  try {
    const contactData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      subject: 'Test Subject',
      message: 'Test message'
    };

    console.log('Inserting into contact_messages:', contactData);

    const response = await fetch(`${SUPABASE_URL}/rest/v1/contact_messages`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(contactData)
    });

    console.log('Response Status:', response.status);

    const responseText = await response.text();
    console.log('Response Body:', responseText);

    if (!response.ok) {
      console.error('❌ INSERT FAILED');
    } else {
      console.log('✅ INSERT SUCCESSFUL!');
    }

  } catch (error) {
    console.error('❌ Exception:', error.message);
  }
}

testContactMessages();
