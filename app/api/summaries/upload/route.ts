import { NextResponse } from "next/server"
import { createClient } from "../../../lib/supabase/server"

export async function POST(req: Request) {
  const supabase = await createClient()
  const formData = await req.formData()
  const file = formData.get("file") as File
  const user_id = formData.get("user_id") as string

  if (!file || !user_id) {
    return NextResponse.json({ error: "File and user_id are required" }, { status: 400 })
  }

  try {
    // Upload file to Supabase Storage (or your storage solution)
    // const { data: uploadData, error: uploadError } = await supabase.storage
    //   .from("summaries")
    //   .upload(`files/${file.name}`, file)

    // For simplicity, use placeholder URL
    const fileUrl = `/uploads/${file.name}`

    // Insert summary record
    const { data, error } = await supabase.from("summaries").insert({
      title: formData.get("title"),
      subject_name: formData.get("subject_name"),
      university_name: formData.get("university_name"),
      semester: formData.get("semester"),
      college: formData.get("college"),
      major: formData.get("major"),
      description: formData.get("description"),
      file_url: fileUrl,
      file_name: file.name,
      file_size: file.size,
      user_id,
      is_approved: false,
    })

    if (error) throw error

    return NextResponse.json({ message: "Summary uploaded successfully" }, { status: 200 })
  } catch (err: any) {
    console.error("Error in /api/summaries/upload:", err)
    return NextResponse.json({ error: err.message || "Unexpected error" }, { status: 500 })
  }
}
