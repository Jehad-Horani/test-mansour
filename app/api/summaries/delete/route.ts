import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { authServer } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    // Verify admin access
    await authServer.requireAdmin()
    
    const { summaryId } = await request.json()
    
    if (!summaryId) {
      return NextResponse.json({ error: "Summary ID is required" }, { status: 400 })
    }

    const supabase = createAdminClient()
    
    const { error } = await supabase
      .from("summaries")
      .delete()
      .eq("id", summaryId)

    if (error) {
      console.error("Error deleting summary:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: "Summary deleted successfully" })
  } catch (error: any) {
    console.error("Error in delete summary:", error)
    if (error.message === "Admin access required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
