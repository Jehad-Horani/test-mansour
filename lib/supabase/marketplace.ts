import { createClient } from "./client"

export interface Book {
  id: string
  title: string
  author: string
  isbn?: string
  edition?: string
  publisher?: string
  publication_year?: number
  subject_name: string
  course_code?: string
  university_name: string
  college: string
  major: string
  description?: string
  condition: 'new' | 'excellent' | 'good' | 'fair' | 'poor'
  original_price?: number
  selling_price: number
  currency: string
  is_available: boolean
  seller_id: string
  approval_status: 'pending' | 'approved' | 'rejected'
  approved_by?: string
  approved_at?: string
  rejection_reason?: string
  created_at: string
  updated_at: string
  sold_at?: string
  buyer_id?: string
  images?: BookImage[]
  seller?: {
    name: string
    avatar_url?: string
    university?: string
  }
}

export interface BookImage {
  id: string
  book_id: string
  image_url: string
  is_primary: boolean
  created_at: string
}

export interface CartItem {
  id: string
  user_id: string
  book_id: string
  quantity: number
  added_at: string
  book?: Book
}

export const marketplaceApi = {
  // Get all books with filters (only approved books for non-admins)
  async getBooks(filters: {
    search?: string
    category?: string
    university?: string
    major?: string
    condition?: string
    minPrice?: number
    maxPrice?: number
    sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'oldest' | 'popular'
    limit?: number
    offset?: number
    includeUnapproved?: boolean // Admin-only
  } = {}) {
    const supabase = createClient()
    
    let query = supabase
      .from('books')
      .select(`
        *,
        book_images(*),
        seller:profiles!books_seller_id_fkey(name, avatar_url, university)
      `)
      .eq('is_available', true)

    // Only show approved books unless specifically requesting unapproved (admin feature)
    if (!filters.includeUnapproved) {
      query = query.eq('approval_status', 'approved')
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,author.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    if (filters.category && filters.category !== 'all') {
      query = query.eq('major', filters.category)
    }

    if (filters.university) {
      query = query.eq('university_name', filters.university)
    }

    if (filters.condition) {
      query = query.eq('condition', filters.condition)
    }

    if (filters.minPrice !== undefined) {
      query = query.gte('selling_price', filters.minPrice)
    }

    if (filters.maxPrice !== undefined) {
      query = query.lte('selling_price', filters.maxPrice)
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'price_asc':
        query = query.order('selling_price', { ascending: true })
        break
      case 'price_desc':
        query = query.order('selling_price', { ascending: false })
        break
      case 'oldest':
        query = query.order('created_at', { ascending: true })
        break
      case 'popular':
        // For now, sort by newest as we don't have popularity metrics yet
        query = query.order('created_at', { ascending: false })
        break
      default:
        query = query.order('created_at', { ascending: false })
    }

    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    return await query
  },

  // Get single book
  async getBook(id: string) {
    const supabase = createClient()
    
    return await supabase
      .from('books')
      .select(`
        *,
        book_images(*),
        seller:profiles!books_seller_id_fkey(name, avatar_url, university, phone)
      `)
      .eq('id', id)
      .single()
  },

  // Create new book listing
  async createBook(book: Omit<Book, 'id' | 'created_at' | 'updated_at' | 'images' | 'seller'>) {
    const supabase = createClient()
    
    return await supabase
      .from('books')
      .insert([book])
      .select()
      .single()
  },

  // Update book
  async updateBook(id: string, updates: Partial<Book>) {
    const supabase = createClient()
    
    return await supabase
      .from('books')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
  },

  // Delete book
  async deleteBook(id: string) {
    const supabase = createClient()
    
    return await supabase
      .from('books')
      .delete()
      .eq('id', id)
  },

  // Mark book as sold
  async markBookAsSold(id: string, buyerId: string) {
    const supabase = createClient()
    
    return await supabase
      .from('books')
      .update({
        is_available: false,
        sold_at: new Date().toISOString(),
        buyer_id: buyerId
      })
      .eq('id', id)
  },

  // Upload book image
  async uploadBookImage(bookId: string, file: File, isPrimary: boolean = false) {
    const supabase = createClient()
    
    const fileExt = file.name.split('.').pop()
    const fileName = `${bookId}_${Date.now()}.${fileExt}`
    const filePath = `book-images/${fileName}`

    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('book-images')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('book-images')
      .getPublicUrl(filePath)

    // Save image record
    const { data: imageData, error: imageError } = await supabase
      .from('book_images')
      .insert([{
        book_id: bookId,
        image_url: urlData.publicUrl,
        is_primary: isPrimary
      }])
      .select()
      .single()

    if (imageError) throw imageError

    return imageData
  },

  // Cart operations
  async getCart(userId: string) {
    const supabase = createClient()
    
    return await supabase
      .from('cart_items')
      .select(`
        *,
        book:books(
          *,
          book_images(*),
          seller:profiles!books_seller_id_fkey(name, avatar_url)
        )
      `)
      .eq('user_id', userId)
      .order('added_at', { ascending: false })
  },

  async addToCart(userId: string, bookId: string, quantity: number = 1) {
    const supabase = createClient()
    
    // Check if item already exists in cart
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('book_id', bookId)
      .single()

    if (existing) {
      // Update quantity
      return await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)
        .select()
        .single()
    } else {
      // Add new item
      return await supabase
        .from('cart_items')
        .insert([{
          user_id: userId,
          book_id: bookId,
          quantity
        }])
        .select()
        .single()
    }
  },

  async updateCartQuantity(cartItemId: string, quantity: number) {
    const supabase = createClient()
    
    if (quantity <= 0) {
      return await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId)
    }
    
    return await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId)
      .select()
      .single()
  },

  async removeFromCart(cartItemId: string) {
    const supabase = createClient()
    
    return await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId)
  },

  async clearCart(userId: string) {
    const supabase = createClient()
    
    return await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId)
  },

  // Get popular categories
  async getPopularCategories() {
    const supabase = createClient()
    
    return await supabase
      .from('books')
      .select('major')
      .eq('is_available', true)
  },

  // Get universities list
  async getUniversities() {
    const supabase = createClient()
    
    return await supabase
      .from('books')
      .select('university_name')
      .eq('is_available', true)
  }
}