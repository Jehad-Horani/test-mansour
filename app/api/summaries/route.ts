import { NextResponse } from "next/server"
import { createClient, createAdminClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("summaries")
      .select(`
        *,
        profiles!summaries_user_id_fkey (
          name,
          avatar_url
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching summaries:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Ensure we return an array
    const summaries = Array.isArray(data) ? data : []
    
    return NextResponse.json(summaries)
  } catch (error: any) {
    console.error("Unexpected error in GET /api/summaries:", error)
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

    const body = await request.json()
    const { title, subject_name, university_name, semester, college, major, description, file_url, file_name, file_size } = body

    const { data, error } = await supabase
      .from("summaries")
      .insert({
        title,
        subject_name,
        university_name,
        semester,
        college,
        major,
        description,
        file_url,
        file_name,
        file_size,
        user_id: user.id,
        status: "pending"
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating summary:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Unexpected error in POST /api/summaries:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}