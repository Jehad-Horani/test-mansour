import { NextResponse } from "next/server"
import { createAdminClient, authServer } from "@/lib/supabase/server"

interface Params {
  params: { id: string }
}

export async function GET(req: Request, { params }: Params) {
  try {
    // Verify admin access
    // await authServer.requireAdmin()

    if (!params.id) {
      return NextResponse.json({ error: "Summary ID is required" }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from("summaries")
      .select("*")
      .eq("id", params.id)
      .single()

    if (error) {
      console.error("Error fetching summary:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    console.error("Error in GET summary:", error)
    if (error.message === "Admin access required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
