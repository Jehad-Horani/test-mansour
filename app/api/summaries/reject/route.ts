import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { authServer } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    // Verify admin access
    await authServer.requireAdmin()
    
    const { summaryId, rejectionReason } = await request.json()
    
    if (!summaryId || !rejectionReason) {
      return NextResponse.json({ error: "Summary ID and rejection reason are required" }, { status: 400 })
    }

    const supabase = createAdminClient()
    
    const { data, error } = await supabase
      .from("summaries")
      .update({
        status: "rejected",
        is_approved: false,
        rejection_reason: rejectionReason,
        approved_at: new Date().toISOString()
      })
      .eq("id", summaryId)
      .select()
      .single()

    if (error) {
      console.error("Error rejecting summary:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error in reject summary:", error)
    if (error.message === "Admin access required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}