import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 })
    }

    // Generate unique file name
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}_${Date.now()}.${fileExt}`
    const filePath = `summaries/${fileName}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("summaries")
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error("Upload error:", uploadError)
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("summaries")
      .getPublicUrl(filePath)

    // Insert summary record
    const { data: summaryData, error: summaryError } = await supabase
      .from("summaries")
      .insert({
        title: formData.get("title"),
        subject_name: formData.get("subject_name"),
        university_name: formData.get("university_name"),
        semester: formData.get("semester"),
        college: formData.get("college"),
        major: formData.get("major"),
        description: formData.get("description"),
        file_url: urlData.publicUrl,
        file_name: file.name,
        file_size: file.size,
        user_id: user.id,
        status: "pending"
      })
      .select()
      .single()

    if (summaryError) {
      console.error("Summary creation error:", summaryError)
      return NextResponse.json({ error: "Failed to save summary" }, { status: 500 })
    }

    return NextResponse.json({ 
      message: "Summary uploaded successfully",
      data: summaryData
    })
  } catch (error: any) {
    console.error("Error in /api/summaries/upload:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}