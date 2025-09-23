import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST() {
  try {
    // Use service role key for admin operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    console.log('Starting database policy fix...')

    // Drop existing policies
    const dropPolicies = `
      DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
      DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
      DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
      DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
      DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
      DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
      DROP POLICY IF EXISTS "Service role can do everything" ON profiles;
      DROP POLICY IF EXISTS "users_can_view_own_profile" ON profiles;
      DROP POLICY IF EXISTS "users_can_update_own_profile" ON profiles;
      DROP POLICY IF EXISTS "users_can_insert_own_profile" ON profiles;
      DROP POLICY IF EXISTS "service_role_full_access" ON profiles;
    `

    const { error: dropError } = await supabase.rpc('exec_sql', { 
      sql: dropPolicies 
    })

    // Create new safe policies
    const createPolicies = `
      -- Ensure RLS is enabled
      ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

      -- Create simple, non-recursive policies
      CREATE POLICY "users_can_view_own_profile" ON profiles
        FOR SELECT 
        USING (auth.uid() = id);

      CREATE POLICY "users_can_update_own_profile" ON profiles
        FOR UPDATE 
        USING (auth.uid() = id);

      CREATE POLICY "users_can_insert_own_profile" ON profiles
        FOR INSERT 
        WITH CHECK (auth.uid() = id);

      CREATE POLICY "service_role_full_access" ON profiles
        FOR ALL 
        USING (auth.role() = 'service_role');

      -- Ensure proper permissions
      GRANT ALL ON profiles TO authenticated;
      GRANT ALL ON profiles TO service_role;
    `

    const { error: createError } = await supabase.rpc('exec_sql', { 
      sql: createPolicies 
    })

    if (dropError) {
      console.warn('Drop policies error (may be expected):', dropError)
    }

    if (createError) {
      console.error('Create policies error:', createError)
      throw createError
    }

    // Add email column if missing
    const { error: alterError } = await supabase.rpc('exec_sql', { 
      sql: `
        DO $$ 
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='email') THEN
            ALTER TABLE profiles ADD COLUMN email TEXT;
          END IF;
        END $$;
      `
    })

    if (alterError) {
      console.warn('Alter table error (may be expected):', alterError)
    }

    console.log('Database policies fixed successfully!')

    return NextResponse.json({ 
      success: true, 
      message: 'Database policies fixed successfully' 
    })

  } catch (error) {
    console.error('Error fixing database policies:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}