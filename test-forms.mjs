import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://snjpwnqaydymkbjwwsdi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuanB3bnFheWR5bWtiand3c2RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2OTkxMTIsImV4cCI6MjA4OTI3NTExMn0.swM4Y6_T0RH-SJk1qjRHt0eJSnI9qif7KbYeZVRoS8U';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('\n🧪 Testing Contact Form Submission...');
const contactResult = await supabase
  .from('contact_messages')
  .insert([{
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test Subject',
    message: 'This is a test message',
    status: 'new'
  }]);

if (contactResult.error) {
  console.error('❌ Contact form FAILED:', contactResult.error.message);
} else {
  console.log('✅ Contact form works!');
}

console.log('\n🧪 Testing Newsletter Subscription...');
const newsletterResult = await supabase
  .from('newsletter_subscribers')
  .insert([{
    email: `test-${Date.now()}@example.com`,
    status: 'active'
  }]);

if (newsletterResult.error) {
  console.error('❌ Newsletter form FAILED:', newsletterResult.error.message);
} else {
  console.log('✅ Newsletter form works!');
}

console.log('\n🧪 Testing Event Registration...');
// First, get an event
const { data: events, error: eventsError } = await supabase
  .from('events')
  .select('id')
  .limit(1);

if (eventsError || !events || events.length === 0) {
  console.log('⚠️  No events found to test registration');
} else {
  const eventRegistrationResult = await supabase
    .from('event_registrations')
    .insert([{
      event_id: events[0].id,
      participant_name: 'Test Participant',
      participant_email: 'participant@example.com',
      participant_phone: '+41 79 123 45 67',
      number_of_people: 2,
      status: 'pending'
    }]);

  if (eventRegistrationResult.error) {
    console.error('❌ Event registration FAILED:', eventRegistrationResult.error.message);
  } else {
    console.log('✅ Event registration works!');
  }
}

console.log('\n✨ Form testing complete!\n');
