import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const search = url.searchParams.get('search') || ''
    const category = url.searchParams.get('category') || ''
    const university = url.searchParams.get('university') || ''
    const condition = url.searchParams.get('condition') || ''
    const minPrice = url.searchParams.get('minPrice')
    const maxPrice = url.searchParams.get('maxPrice')
    const sortBy = url.searchParams.get('sortBy') || 'newest'
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    
    const supabase = createClient()
    
    let query = supabase
      .from('books')
      .select(`
        *,
        book_images(*),
        seller:profiles!books_seller_id_fkey(name, avatar_url, university)
      `, { count: 'exact' })
      .eq('is_available', true)
      .eq('approval_status', 'approved')
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%,description.ilike.%${search}%`)
    }
    
    if (category && category !== 'all') {
      query = query.eq('major', category)
    }
    
    if (university) {
      query = query.eq('university_name', university)
    }
    
    if (condition) {
      query = query.eq('condition', condition)
    }
    
    if (minPrice) {
      query = query.gte('selling_price', parseFloat(minPrice))
    }
    
    if (maxPrice) {
      query = query.lte('selling_price', parseFloat(maxPrice))
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'price_asc':
        query = query.order('selling_price', { ascending: true })
        break
      case 'price_desc':
        query = query.order('selling_price', { ascending: false })
        break
      case 'oldest':
        query = query.order('created_at', { ascending: true })
        break
      default:
        query = query.order('created_at', { ascending: false })
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
    console.error("Error in GET /api/books:", error)
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
    
    const bookData = await request.json()
    
    const { data, error } = await supabase
      .from('books')
      .insert([{
        ...bookData,
        seller_id: user.id,
        approval_status: 'pending'
      }])
      .select()
      .single()
    
    if (error) {
      console.error("Error creating book:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error in POST /api/books:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}