// app/api/notebooks/upload/route.ts
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { authServer } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const user = await authServer.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const subject_name = formData.get('subject_name') as string
    const university_name = formData.get('university_name') as string
    const major = formData.get('major') as string
    const lecture_date = formData.get('lecture_date') as string
    const duration_minutes = parseInt(formData.get('duration_minutes') as string || '60')

    // Validate required fields
    if (!title || !subject_name || !university_name || !major || !lecture_date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const supabase = createClient()
    
    let file_url = null
    let file_name = null

    // Handle file upload if provided
    if (file) {
      // Validate file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        return NextResponse.json(
          { error: "File size must be less than 50MB" },
          { status: 400 }
        )
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      ]

      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: "Invalid file type. Only PDF, DOC, DOCX, PPT, and PPTX are allowed" },
          { status: 400 }
        )
      }

      // Generate unique file name
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `lectures/${fileName}`

      // Convert File to ArrayBuffer then to Uint8Array
      const arrayBuffer = await file.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('lectures')
        .upload(filePath, uint8Array, {
          contentType: file.type,
          upsert: false
        })

      if (uploadError) {
        console.error("Storage upload error:", uploadError)
        return NextResponse.json(
          { error: "Failed to upload file" },
          { status: 500 }
        )
      }

      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('lectures')
        .getPublicUrl(filePath)

      file_url = urlData.publicUrl
      file_name = file.name
    }

    // Insert lecture record into database
    const { data: lecture, error: dbError } = await supabase
      .from('daily_lectures')
      .insert([
        {
          instructor_id: user.id,
          title,
          description,
          subject_name,
          university_name,
          major,
          lecture_date: new Date(lecture_date).toISOString(),
          duration_minutes,
          file_url,
          file_name,
          approval_status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (dbError) {
      console.error("Database insert error:", dbError)
      
      // If database insert fails and we uploaded a file, try to delete it
      if (file_url) {
        const fileName = file_url.split('/').pop()
        await supabase.storage
          .from('lectures')
          .remove([`lectures/${fileName}`])
      }

      return NextResponse.json(
        { error: "Failed to save lecture" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      lecture
    })

  } catch (error) {
    console.error("Error in POST /api/notebooks/upload:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}