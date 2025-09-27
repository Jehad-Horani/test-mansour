import { NextResponse } from "next/server"
import { createAdminClient, authServer } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    // Verify admin access
    await authServer.requireAdmin()
    
    const url = new URL(request.url)
    const status = url.searchParams.get('status') || 'pending'
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    
    const supabase = createAdminClient()
    
    let query = supabase
      .from('daily_lectures')
      .select(`
        *,
        instructor:profiles!daily_lectures_instructor_id_fkey(name, university, phone)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
    
    if (status !== 'all') {
      query = query.eq('approval_status', status)
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
    console.error("Error in GET /api/admin/lectures:", error)
    if (error.message === "Admin access required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    // Verify admin access
    const admin = await authServer.requireAdmin()
    
    const { lectureId, action, reason } = await request.json()
    
    if (!lectureId || !action) {
      return NextResponse.json({ error: "Lecture ID and action are required" }, { status: 400 })
    }
    
    const supabase = createAdminClient()
    
    let updates: any = {
      approved_at: new Date().toISOString(),
      approved_by: admin.id
    }
    
    if (action === 'approve') {
      updates.approval_status = 'approved'
    } else if (action === 'reject') {
      updates.approval_status = 'rejected'
      updates.rejection_reason = reason
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
    
    const { data, error } = await supabase
      .from('daily_lectures')
      .update(updates)
      .eq('id', lectureId)
      .select()
      .single()
    
    if (error) {
      console.error("Error updating lecture:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // Log admin activity
    await supabase
      .from('admin_activities')
      .insert([{
        admin_id: admin.id,
        action: `${action}_lecture`,
        target_type: 'lecture',
        target_id: lectureId,
        details: {
          lecture_title: data.title,
          reason: reason || null
        }
      }])
    
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error in PATCH /api/admin/lectures:", error)
    if (error.message === "Admin access required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}