import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://yssqdsghuowgxiopfxcq.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImE5NzA5M2ZlLTU5N2ItNGQ0ZS04NjA0LTNmMjZhZjM2NmIxYiJ9.eyJwcm9qZWN0SWQiOiJ5c3NxZHNnaHVvd2d4aW9wZnhjcSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY5NjY3MjY5LCJleHAiOjIwODUwMjcyNjksImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.Ea_CeKKltZnG4nj3acS51kjDIUm9VKQCreY0rFrL4rM';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };