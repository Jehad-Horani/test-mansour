import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    console.log("📄 Starting summary upload...")
    
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.error("❌ No user found in request")
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    console.log("✅ User authenticated:", user.id)

    const formData = await req.formData()
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
    const filePath = `summaries/${fileName}`

    console.log("📤 Uploading to:", filePath)

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("summaries")
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error("❌ Upload error:", uploadError)
      return NextResponse.json({ 
        error: "Failed to upload file", 
        details: uploadError.message 
      }, { status: 500 })
    }

    console.log("✅ File uploaded successfully:", uploadData.path)

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("summaries")
      .getPublicUrl(filePath)

    console.log("🔗 Public URL:", urlData.publicUrl)

    // Collect form data
    const summaryData = {
      title: formData.get("title") as string,
      subject_name: formData.get("subject_name") as string,
      university_name: formData.get("university_name") as string,
      semester: formData.get("semester") as string,
      college: formData.get("college") as string,
      major: formData.get("major") as string,
      description: formData.get("description") as string,
      file_url: urlData.publicUrl,
      file_name: file.name,
      file_size: file.size,
      user_id: user.id,
      is_approved: false, // Use is_approved instead of status (pending = false, approved = true)
      status: formData.get("pending")
    }

    console.log("💾 Saving summary data:", summaryData)

    // Insert summary record
    const { data: summary, error: summaryError } = await supabase
      .from("summaries")
      .insert(summaryData)
      .select()
      .single()

    if (summaryError) {
      console.error("❌ Summary creation error:", summaryError)
      return NextResponse.json({ 
        error: "Failed to save summary", 
        details: summaryError.message 
      }, { status: 500 })
    }

    console.log("✅ Summary created successfully:", summary.id)

    return NextResponse.json({ 
      message: "Summary uploaded successfully",
      data: summary,
      file_url: urlData.publicUrl
    })
  } catch (error: any) {
    console.error("💥 Error in /api/summaries/upload:", error)
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error.message 
    }, { status: 500 })
  }
}