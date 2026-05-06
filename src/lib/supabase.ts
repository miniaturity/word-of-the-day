import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

console.log('supabase url:', PUBLIC_SUPABASE_URL);
console.log('anon key set:', !!PUBLIC_SUPABASE_ANON_KEY);

export const supabase = createClient(
    "https://ovxtglvazdszrdwfcyaj.supabase.co/",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92eHRnbHZhemRzenJkd2ZjeWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4Mjk3NTYsImV4cCI6MjA5MzQwNTc1Nn0.11-OQk8OCsqYmfkkDKjiWis-vw2eqps1auF9yXRh5Xo"
);
