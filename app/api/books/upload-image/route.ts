import { NextResponse } from "next/server"
import { createClient, authServer } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const user = await authServer.requireAuth()
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    const bookId = formData.get('bookId') as string
    const isPrimary = formData.get('isPrimary') === 'true'
    
    if (!file || !bookId) {
      return NextResponse.json({ error: "File and book ID are required" }, { status: 400 })
    }
    
    const supabase = createClient()
    
    // Verify user owns this book
    const { data: book } = await supabase
      .from('books')
      .select('seller_id')
      .eq('id', bookId)
      .single()
    
    if (!book || book.seller_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }
    
    // Generate unique file name
    const fileExt = file.name.split('.').pop()
    const fileName = `${bookId}_${Date.now()}.${fileExt}`
    const filePath = `book-images/${fileName}`
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('book-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (uploadError) {
      console.error("Upload error:", uploadError)
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('book-images')
      .getPublicUrl(filePath)
    
    // If this is primary image, make others non-primary
    if (isPrimary) {
      await supabase
        .from('book_images')
        .update({ is_primary: false })
        .eq('book_id', bookId)
    }
    
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
    
    if (imageError) {
      console.error("Image record creation error:", imageError)
      return NextResponse.json({ error: "Failed to save image record" }, { status: 500 })
    }
    
    return NextResponse.json({
      message: "Image uploaded successfully",
      data: imageData
    })
  } catch (error: any) {
    console.error("Error in /api/books/upload-image:", error)
    if (error.message === "Authentication required") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}