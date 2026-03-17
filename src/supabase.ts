import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://snjpwnqaydymkbjwwsdi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuanB3bnFheWR5bWtianZ3c2RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0ODI0OTQsImV4cCI6MjA1ODA1ODQ5NH0.gxXMFdFrScqFGiFiDhFTZ2SVZF45wQFq_D0LCjvAsSE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
