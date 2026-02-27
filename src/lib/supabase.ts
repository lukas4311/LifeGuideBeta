import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://ncicolkaienssdbqdhfu.supabase.co';
const supabaseKey = 'sb_publishable_bK19QM7JRWvRG38wkVfBmw_WOzfS-ok';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };