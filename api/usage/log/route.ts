import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logUsage, ResourceType } from '@/lib/usage-tracker'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { resourceType, resourceId } = body as { 
      resourceType: ResourceType
      resourceId?: string 
    }

    if (!resourceType) {
      return NextResponse.json(
        { error: 'Missing resourceType' },
        { status: 400 }
      )
    }

    // Get user profile to check subscription tier
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      return NextResponse.json(
        { error: 'Failed to fetch user profile' },
        { status: 500 }
      )
    }

    // Only log usage for free tier users
    if (profile.subscription_tier !== 'free') {
      return NextResponse.json({
        success: true,
        logged: false,
        message: 'Usage not tracked for non-free users'
      })
    }

    // Log usage
    const success = await logUsage(user.id, resourceType, resourceId)

    return NextResponse.json({
      success,
      logged: true
    })

  } catch (error) {
    console.error('Error in usage log:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
