import { NextResponse } from "next/server"
import { createClient, createAdminClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("summaries")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching summaries:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Ensure we return an array and map is_approved -> status
    const summaries = (Array.isArray(data) ? data : []).map((s) => ({
      ...s,
      status: s.is_approved
        ? "approved"
        : s.rejection_reason
          ? "rejected"
          : "pending",
    }))

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
        is_approved: false, // default pending
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating summary:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // رجّع الملخص الجديد مع status
    const summaryWithStatus = {
      ...data,
      status: data.is_approved
        ? "approved"
        : data.rejection_reason
          ? "rejected"
          : "pending",
    }

    return NextResponse.json(summaryWithStatus)
  } catch (error: any) {
    console.error("Unexpected error in POST /api/summaries:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
