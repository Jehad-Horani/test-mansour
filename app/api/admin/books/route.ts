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
      .from('books')
      .select(`
        *,
        book_images(*),
        seller:profiles!books_seller_id_fkey(name, university, phone)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
    
    if (status !== 'all') {
      query = query.eq('approval_status', status)
    }
    
    const { data, error, count } = await query
      .range((page - 1) * limit, page * limit - 1)
    
    if (error) {
      console.error("Error fetching books:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({
      books: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error: any) {
    console.error("Error in GET /api/admin/books:", error)
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
    
    const { bookId, action, reason } = await request.json()
    
    if (!bookId || !action) {
      return NextResponse.json({ error: "Book ID and action are required" }, { status: 400 })
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
      .from('books')
      .update(updates)
      .eq('id', bookId)
      .select()
      .single()
    
    if (error) {
      console.error("Error updating book:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // Log admin activity
    await supabase
      .from('admin_activities')
      .insert([{
        admin_id: admin.id,
        action: `${action}_book`,
        target_type: 'book',
        target_id: bookId,
        details: {
          book_title: data.title,
          reason: reason || null
        }
      }])
    
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error in PATCH /api/admin/books:", error)
    if (error.message === "Admin access required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    // Verify admin access
    const admin = await authServer.requireAdmin()
    
    const { bookId } = await request.json()
    
    if (!bookId) {
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 })
    }
    
    const supabase = createAdminClient()
    
    // Get book details for logging
    const { data: book } = await supabase
      .from('books')
      .select('title')
      .eq('id', bookId)
      .single()
    
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', bookId)
    
    if (error) {
      console.error("Error deleting book:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // Log admin activity
    await supabase
      .from('admin_activities')
      .insert([{
        admin_id: admin.id,
        action: 'delete_book',
        target_type: 'book',
        target_id: bookId,
        details: {
          book_title: book?.title || 'Unknown'
        }
      }])
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error in DELETE /api/admin/books:", error)
    if (error.message === "Admin access required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}