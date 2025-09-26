import { NextResponse } from "next/server"
import { createClient, createAdminClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const approved = url.searchParams.get('approved') !== 'false'
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const userId = url.searchParams.get('userId')
    
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
    }
    
    if (userId) {
      query = query.eq('instructor_id', userId)
    }
    
    const { data, error, count } = await query
      .range((page - 1) * limit, page * limit - 1)
    
    if (error) {
      console.error("Error fetching lectures:", error)
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
    console.error("Error in GET /api/lectures:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    
    const lectureData = await request.json()
    
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
      console.error("Error creating lecture:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error in POST /api/lectures:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}