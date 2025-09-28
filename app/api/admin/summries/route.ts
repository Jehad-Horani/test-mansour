// api/summaries/route.ts
import { NextResponse } from "next/server"
import { createAdminClient, authServer } from "@/lib/supabase/server"

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

    // Ensure we return an array
    const summaries = Array.isArray(data) ? data : []

    return NextResponse.json(summaries)
  } catch (error: any) {
    console.error("Unexpected error in GET /api/admin/summries:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
