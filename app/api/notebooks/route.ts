import { NextResponse } from "next/server"
import { createClient, authServer } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const user = await authServer.requireAuth()
    
    const url = new URL(request.url)
    const approved = url.searchParams.get('approved') === 'true'
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    
    const supabase = createClient()
    
    let query = supabase
      .from('daily_lectures')
      .select(`
        *,
        instructor:profiles!daily_lectures_instructor_id_fkey(name, avatar_url, university)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
    
    if (approved) {
      query = query.eq('approval_status', 'approved')
    } else {
      // Show user's own lectures regardless of approval status
      query = query.eq('instructor_id', user.id)
    }
    
    const { data, error, count } = await query
      .range((page - 1) * limit, page * limit - 1)
    
    if (error) {
      console.error("Error fetching notebooks:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({
      lectures: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error: any) {
    console.error("Error in GET /api/notebooks:", error)
    if (error.message === "Authentication required") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await authServer.requireAuth()
    
    const lectureData = await request.json()
    
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('daily_lectures')
      .insert([{
        ...lectureData,
        instructor_id: user.id,
        approval_status: 'pending'
      }])
      .select()
      .single()
    
    if (error) {
      console.error("Error creating notebook:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error in POST /api/notebooks:", error)
    if (error.message === "Authentication required") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}