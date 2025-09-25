import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    console.log("🎓 Starting lecture upload...")
    
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.error("❌ No user found in request")
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    console.log("✅ User authenticated:", user.id)
    
    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      console.error("❌ No file found in request")
      return NextResponse.json({ error: "File is required" }, { status: 400 })
    }

    console.log("📁 File received:", file.name, "Size:", file.size)

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      console.error("❌ File too large:", file.size)
      return NextResponse.json({ error: "File too large. Maximum size is 50MB" }, { status: 400 })
    }

    // Generate unique file name
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}_${Date.now()}.${fileExt}`
    const filePath = `lectures/${fileName}`

    console.log("📤 Uploading to:", filePath)

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("lectures")
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error("❌ Lecture upload error:", uploadError)
      return NextResponse.json({ 
        error: "Failed to upload lecture file", 
        details: uploadError.message 
      }, { status: 500 })
    }

    console.log("✅ File uploaded successfully:", uploadData.path)

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("lectures")
      .getPublicUrl(filePath)

    console.log("🔗 Public URL:", urlData.publicUrl)

    // Collect form data
    const lectureData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      subject_name: formData.get("subject_name") as string,
      university_name: formData.get("university_name") as string,
      major: formData.get("major") as string,
      lecture_date: formData.get("lecture_date") as string,
      duration_minutes: parseInt(formData.get("duration_minutes") as string) || 60,
      file_url: urlData.publicUrl,
      file_name: file.name,
      instructor_id: user.id,
      approval_status: "pending"
    }

    console.log("💾 Saving lecture data:", lectureData)

    // Create lecture record in daily_lectures table
    const { data: lecture, error: lectureError } = await supabase
      .from("daily_lectures")
      .insert(lectureData)
      .select()
      .single()

    if (lectureError) {
      console.error("❌ Lecture creation error:", lectureError)
      return NextResponse.json({ 
        error: "Failed to save lecture", 
        details: lectureError.message 
      }, { status: 500 })
    }

    console.log("✅ Lecture created successfully:", lecture.id)

    return NextResponse.json({ 
      message: "Lecture uploaded successfully",
      data: lecture,
      file_url: urlData.publicUrl
    })
  } catch (error: any) {
    console.error("💥 Error in /api/notebooks/upload:", error)
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error.message 
    }, { status: 500 })
  }
}