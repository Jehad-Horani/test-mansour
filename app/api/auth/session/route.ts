import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    console.log('[SESSION API] Processing session request...')
    
    const supabase = createClient()

    // Get the current session (more reliable than just getUser)
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      console.error("[SESSION API] Session error:", sessionError.message)
      return NextResponse.json({ 
        session: null, 
        userProfile: null,
        error: `Session error: ${sessionError.message}`
      })
    }

    if (!session?.user) {
      console.log("[SESSION API] No authenticated session")
      return NextResponse.json({ 
        session: null, 
        userProfile: null,
        error: "Auth session missing!"
      })
    }

    console.log(`[SESSION API] Valid session found for user: ${session.user.id}`)

    // Get the user's profile with better error handling
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (profileError) {
      console.warn(`[SESSION API] Profile fetch warning: ${profileError.message}`)
      
      // Create fallback profile from session metadata
      const fallbackProfile = {
        id: session.user.id,
        name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'مستخدم',
        email: session.user.email,
        phone: session.user.user_metadata?.phone,
        university: Array.isArray(session.user.user_metadata?.university) 
          ? session.user.user_metadata.university[0] 
          : session.user.user_metadata?.university || 'جامعة افتراضية',
        major: session.user.user_metadata?.major || 'law',
        year: session.user.user_metadata?.year || '1',
        role: session.user.user_metadata?.role || 'student',
        subscription_tier: 'free',
        avatar_url: session.user.user_metadata?.avatar_url,
        bio: session.user.user_metadata?.bio,
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
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      return NextResponse.json({
        session: session,
        userProfile: fallbackProfile,
        error: null,
        warning: 'Using fallback profile data'
      })
    }

    console.log(`[SESSION API] Profile loaded successfully for: ${profile.name}`)

    return NextResponse.json({
      session: session,
      userProfile: profile,
      error: null
    })

  } catch (error: any) {
    console.error("[SESSION API] Unexpected error:", error)
    return NextResponse.json({
      session: null,
      userProfile: null,
      error: "Internal server error occurred"
    }, { status: 500 })
  }
}