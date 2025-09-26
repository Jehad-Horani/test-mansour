import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    console.log("🖼️ Starting avatar upload...")
    
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.error("❌ No user found in request")
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    console.log("✅ User authenticated:", user.id)
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      console.error("❌ No file found in request")
      return NextResponse.json({ error: "File is required" }, { status: 400 })
    }

    console.log("📁 File received:", file.name, "Size:", file.size, "Type:", file.type)

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      console.error("❌ Invalid file type:", file.type)
      return NextResponse.json({ error: "Invalid file type. Only JPEG, PNG, and WebP are allowed" }, { status: 400 })
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      console.error("❌ File too large:", file.size)
      return NextResponse.json({ error: "File too large. Maximum size is 5MB" }, { status: 400 })
    }
    
    // Generate unique file name
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}_${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    console.log("📤 Uploading to:", filePath)

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Allow overwriting
      })

    if (uploadError) {
      console.error("❌ Avatar upload error:", uploadError)
      return NextResponse.json({ 
        error: "Failed to upload avatar", 
        details: uploadError.message 
      }, { status: 500 })
    }

    console.log("✅ File uploaded successfully:", uploadData.path)

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    console.log("🔗 Public URL:", urlData.publicUrl)

    // Update user profile with new avatar URL
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        avatar_url: urlData.publicUrl,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (profileError) {
      console.error("❌ Profile update error:", profileError)
      return NextResponse.json({ 
        error: "Failed to update profile", 
        details: profileError.message 
      }, { status: 500 })
    }

    console.log("✅ Profile updated successfully")

    return NextResponse.json({ 
      message: "Avatar uploaded successfully",
      avatar_url: urlData.publicUrl,
      profile: profileData
    })
  } catch (error: any) {
    console.error("💥 Error in /api/profile/upload-avatar:", error)
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error.message 
    }, { status: 500 })
  }
}