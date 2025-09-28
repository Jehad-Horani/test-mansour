import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

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

    // نضيف حقل status بناءً على is_approved
    const summariesWithStatus = (data || []).map((summary: any) => ({
      ...summary,
      status: summary.is_approved === null ? "pending" : summary.is_approved ? "approved" : "rejected"
    }))

    return NextResponse.json(summariesWithStatus)
  } catch (error: any) {
    console.error("Unexpected error in GET /api/admin/summaries:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

