import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://snjpwnqaydymkbjwwsdi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuanB3bnFheWR5bWtiand3c2RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2OTkxMTIsImV4cCI6MjA4OTI3NTExMn0.swM4Y6_T0RH-SJk1qjRHt0eJSnI9qif7KbYeZVRoS8U';

export const supabase = createClient(supabaseUrl, supabaseKey);
