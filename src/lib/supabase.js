import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tscqcylmsgjveowelkrn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzY3FjeWxtc2dqdmVvd2Vsa3JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3NjczMzMsImV4cCI6MjA2MjM0MzMzM30.ao1_3rEhqQWxz-RI8vMa5VCkjxbuKL14GcvRDYg9f_M';

export const supabase = createClient(supabaseUrl, supabaseKey);
