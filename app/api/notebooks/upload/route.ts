import { NextResponse } from "next/server"
import { createClient, authServer } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const user = await authServer.requireAuth()
    
    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 })
    }

    const supabase = createClient()

    // Generate unique file name
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}_${Date.now()}.${fileExt}`
    const filePath = `lectures/${fileName}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("lectures")
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error("Lecture upload error:", uploadError)
      return NextResponse.json({ error: "Failed to upload lecture file" }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("lectures")
      .getPublicUrl(filePath)

    // Create lecture record in daily_lectures table
    const { data: lectureData, error: lectureError } = await supabase
      .from("daily_lectures")
      .insert({
        title: formData.get("title"),
        description: formData.get("description"),
        subject_name: formData.get("subject_name"),
        university_name: formData.get("university_name"),
        major: formData.get("major"),
        lecture_date: formData.get("lecture_date"),
        duration_minutes: parseInt(formData.get("duration_minutes") as string) || 60,
        file_url: urlData.publicUrl,
        file_name: file.name,
        instructor_id: user.id,
        approval_status: "pending"
      })
      .select()
      .single()

    if (lectureError) {
      console.error("Lecture creation error:", lectureError)
      return NextResponse.json({ error: "Failed to save lecture" }, { status: 500 })
    }

    return NextResponse.json({ 
      message: "Lecture uploaded successfully",
      data: lectureData
    })
  } catch (error: any) {
    console.error("Error in /api/notebooks/upload:", error)
    if (error.message === "Authentication required") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}