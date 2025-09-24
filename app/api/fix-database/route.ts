import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    // Use service role key for admin operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    console.log('[DB FIX] Starting database fixes...')

    // Read the SQL fix file
    const sqlFilePath = join(process.cwd(), 'enhanced-complete-fix.sql')
    const sqlContent = readFileSync(sqlFilePath, 'utf-8')

    // Split SQL into individual commands
    const sqlCommands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd && !cmd.startsWith('--') && cmd !== '')

    const results = []
    let successCount = 0
    let errorCount = 0

    for (const command of sqlCommands) {
      if (command.trim()) {
        try {
          const { data, error } = await supabaseAdmin.rpc('exec_sql', {
            sql_query: command
          }).catch(async () => {
            // If RPC doesn't work, try direct query for some commands
            if (command.includes('SELECT')) {
              return await supabaseAdmin.from('profiles').select('*').limit(1)
            }
            return { data: null, error: { message: 'Command execution failed' } }
          })

          if (error) {
            console.warn(`[DB FIX] Warning for command "${command.substring(0, 50)}...": ${error.message}`)
            errorCount++
            results.push({ command: command.substring(0, 50) + '...', status: 'warning', error: error.message })
          } else {
            successCount++
            results.push({ command: command.substring(0, 50) + '...', status: 'success' })
          }
        } catch (err: any) {
          console.error(`[DB FIX] Error executing command "${command.substring(0, 50)}...":`, err.message)
          errorCount++
          results.push({ command: command.substring(0, 50) + '...', status: 'error', error: err.message })
        }
      }
    }

    // Now create profiles for users without them
    console.log('[DB FIX] Creating missing profiles...')

    // Get all auth users
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()
    if (authError) {
      console.error('[DB FIX] Error fetching auth users:', authError.message)
    }

    // Get existing profiles
    const { data: existingProfiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('id')

    if (!profilesError && authUsers?.users) {
      const existingProfileIds = new Set(existingProfiles?.map(p => p.id) || [])
      const usersNeedingProfiles = authUsers.users.filter(user => !existingProfileIds.has(user.id))

      console.log(`[DB FIX] Found ${usersNeedingProfiles.length} users needing profiles`)

      for (const user of usersNeedingProfiles) {
        const profileData = {
          id: user.id,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'مستخدم جديد',
          phone: user.user_metadata?.phone,
          university: user.user_metadata?.university,
          major: user.user_metadata?.major,
          year: user.user_metadata?.year,
          role: user.user_metadata?.role || 'student',
          subscription_tier: 'free',
          preferences: {
            theme: 'retro',
            language: 'ar',
            emailNotifications: true,
            pushNotifications: true,
            profileVisibility: 'university'
          },
          stats: {
            uploadsCount: 0,
            viewsCount: 0,
            helpfulVotes: 0,
            coursesEnrolled: 0,
            booksOwned: 0,
            consultations: 0,
            communityPoints: 0
          }
        }

        const { error: insertError } = await supabaseAdmin
          .from('profiles')
          .insert(profileData)

        if (insertError) {
          console.error(`[DB FIX] Error creating profile for ${user.email}:`, insertError.message)
          errorCount++
          results.push({ 
            command: `Create profile for ${user.email}`, 
            status: 'error', 
            error: insertError.message 
          })
        } else {
          console.log(`[DB FIX] Created profile for ${user.email}`)
          successCount++
          results.push({ 
            command: `Create profile for ${user.email}`, 
            status: 'success' 
          })
        }
      }
    }

    // Final verification
    const { data: finalProfiles, error: verifyError } = await supabaseAdmin
      .from('profiles')
      .select('id, name, email')

    console.log(`[DB FIX] Completed! Total profiles: ${finalProfiles?.length || 0}`)

    return NextResponse.json({
      success: true,
      message: 'Database fixes completed',
      statistics: {
        successCount,
        errorCount,
        totalProfiles: finalProfiles?.length || 0
      },
      results: results.slice(-20) // Show last 20 results
    })

  } catch (error: any) {
    console.error('[DB FIX] General error:', error.message)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}