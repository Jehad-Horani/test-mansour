import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('books')
      .select(`
        *,
        book_images(*),
        seller:profiles!books_seller_id_fkey(name, avatar_url, university, phone)
      `)
      .eq('id', id)
      .single()
    
    if (error) {
      console.error("Error fetching book:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    if (!data) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }
    
    // Only show approved books or owner's own books
    const { data: { user } } = await supabase.auth.getUser()
    const isOwner = user && user.id === data.seller_id
    const isAdmin = user && (await supabase.from('profiles').select('role').eq('id', user.id).single()).data?.role === 'admin'
    
  if (data.approval_status !== 'approved' && !isOwner && !isAdmin) {
  data.seller = await supabase
    .from('profiles')
    .select('name, avatar_url, university, phone')
    .eq('id', data.seller_id)
    .single()
    .then(res => res.data || null)
}

    
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error in GET /api/books/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const updates = await request.json()
    
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    
    // Check if user owns this book or is admin
    const { data: book } = await supabase
      .from('books')
      .select('seller_id')
      .eq('id', id)
      .single()
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    const isOwner = book && book.seller_id === user.id
    const isAdmin = profile && profile.role === 'admin'
    
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }
    
    const { data, error } = await supabase
      .from('books')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        book_images(*),
        seller:profiles!books_seller_id_fkey(name, avatar_url, university, phone)
      `)
      .single()
    
    if (error) {
      console.error("Error updating book:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error in PATCH /api/books/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    
    // Check if user owns this book or is admin
    const { data: book } = await supabase
      .from('books')
      .select('seller_id')
      .eq('id', id)
      .single()
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    const isOwner = book && book.seller_id === user.id
    const isAdmin = profile && profile.role === 'admin'
    
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }
    
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error("Error deleting book:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error in DELETE /api/books/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}