// api/summaries/route.ts
import { NextResponse } from "next/server"
import { createAdminClient, authServer } from "@/lib/supabase/server"

export async function GET() {
  try {
    await authServer.requireAdmin()
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from("summaries")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching summaries:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const summaries = (data || []).map((s) => ({
      ...s,
      status: s.status || (s.is_approved ? "approved" : "pending"), // fallback
    }))

    return NextResponse.json(summaries)
  } catch (error: any) {
    console.error("Unexpected error in GET /api/summaries:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
