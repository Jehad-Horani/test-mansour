import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkUsageLimit, FREE_TIER_LIMITS, ResourceType } from '@/lib/usage-tracker'

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
    const { resourceType } = body as { resourceType: ResourceType }

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

    // Only apply restrictions to free tier users
    if (profile.subscription_tier !== 'free') {
      return NextResponse.json({
        allowed: true,
        currentCount: 0,
        limit: -1,
        isFree: false
      })
    }

    // Check usage limit for free users
    const limit = FREE_TIER_LIMITS[resourceType]
    const { allowed, currentCount } = await checkUsageLimit(user.id, resourceType, limit)

    return NextResponse.json({
      allowed,
      currentCount,
      limit,
      isFree: true
    })

  } catch (error) {
    console.error('Error in usage check:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
