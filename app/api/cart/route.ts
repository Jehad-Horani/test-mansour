import { NextResponse } from "next/server"
import { createClient, authServer } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const user = await authServer.requireAuth()
    
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        book:books(
          *,
          book_images(*),
          seller:profiles!books_seller_id_fkey(name, avatar_url, phone)
        )
      `)
      .eq('user_id', user.id)
      .order('added_at', { ascending: false })
    
    if (error) {
      console.error("Error fetching cart:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error("Error in GET /api/cart:", error)
    if (error.message === "Authentication required") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await authServer.requireAuth()
    
    const { bookId, quantity = 1 } = await request.json()
    
    if (!bookId) {
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 })
    }
    
    const supabase = createClient()
    
    // Check if book exists and is available
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select('id, seller_id, is_available, approval_status')
      .eq('id', bookId)
      .single()
    
    if (bookError || !book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }
    
    if (!book.is_available) {
      return NextResponse.json({ error: "Book is not available" }, { status: 400 })
    }
    
    if (book.approval_status !== 'approved') {
      return NextResponse.json({ error: "Book is not approved yet" }, { status: 400 })
    }
    
    if (book.seller_id === user.id) {
      return NextResponse.json({ error: "You cannot add your own book to cart" }, { status: 400 })
    }
    
    // Check if item already exists in cart
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('book_id', bookId)
      .single()
    
    if (existing) {
      // Update quantity
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)
        .select(`
          *,
          book:books(
            *,
            book_images(*),
            seller:profiles!books_seller_id_fkey(name, avatar_url)
          )
        `)
        .single()
      
      if (error) {
        console.error("Error updating cart item:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json(data)
    } else {
      // Add new item
      const { data, error } = await supabase
        .from('cart_items')
        .insert([{
          user_id: user.id,
          book_id: bookId,
          quantity
        }])
        .select(`
          *,
          book:books(
            *,
            book_images(*),
            seller:profiles!books_seller_id_fkey(name, avatar_url)
          )
        `)
        .single()
      
      if (error) {
        console.error("Error adding to cart:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json(data)
    }
  } catch (error: any) {
    console.error("Error in POST /api/cart:", error)
    if (error.message === "Authentication required") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await authServer.requireAuth()
    
    const { cartItemId, quantity } = await request.json()
    
    if (!cartItemId || quantity === undefined) {
      return NextResponse.json({ error: "Cart item ID and quantity are required" }, { status: 400 })
    }
    
    const supabase = createClient()
    
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId)
        .eq('user_id', user.id)
      
      if (error) {
        console.error("Error removing cart item:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json({ success: true, removed: true })
    }
    
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId)
      .eq('user_id', user.id)
      .select(`
        *,
        book:books(
          *,
          book_images(*),
          seller:profiles!books_seller_id_fkey(name, avatar_url)
        )
      `)
      .single()
    
    if (error) {
      console.error("Error updating cart item:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error in PATCH /api/cart:", error)
    if (error.message === "Authentication required") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await authServer.requireAuth()
    
    const url = new URL(request.url)
    const cartItemId = url.searchParams.get('itemId')
    const clearAll = url.searchParams.get('clearAll') === 'true'
    
    const supabase = createClient()
    
    if (clearAll) {
      // Clear entire cart
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
      
      if (error) {
        console.error("Error clearing cart:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json({ success: true, cleared: true })
    }
    
    if (!cartItemId) {
      return NextResponse.json({ error: "Cart item ID is required" }, { status: 400 })
    }
    
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId)
      .eq('user_id', user.id)
    
    if (error) {
      console.error("Error removing cart item:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error in DELETE /api/cart:", error)
    if (error.message === "Authentication required") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}