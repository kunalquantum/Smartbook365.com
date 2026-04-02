import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wkbdaqnygopnnysrskru.supabase.co';
const supabaseKey = 'sb_publishable_tvT-rgq4oFxeDjLcORuWUQ_bbv2owPE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectAndSetupAdmin() {
  console.log('Inspecting Smartbook365Users table...');
  
  // Try to get one user to see columns
  const { data: users, error: fetchError } = await supabase
    .from('Smartbook365Users')
    .select('*')
    .limit(1);

  if (fetchError) {
    console.error('Fetch Error:', fetchError.message);
    return;
  }

  console.log('Available columns:', users.length > 0 ? Object.keys(users[0]) : 'No records found to inspect.');

  console.log('Upserting Admin User...');
  
  // Base record
  const adminRecord = {
    username: 'admin',
    password: 'admin'
  };

  // Add subscriptions if column exists
  if (users.length > 0 && 'subscriptions' in users[0]) {
    adminRecord.subscriptions = { physics: "all", chemistry: "all", maths: "all" };
  }

  const { data, error: upsertError } = await supabase
    .from('Smartbook365Users')
    .upsert([adminRecord], { onConflict: 'username' });

  if (upsertError) {
    console.error('Upsert Error:', upsertError.message);
  } else {
    console.log('Admin user "admin/admin" has been successfully set up (without role column if missing)!');
  }
}

inspectAndSetupAdmin();
