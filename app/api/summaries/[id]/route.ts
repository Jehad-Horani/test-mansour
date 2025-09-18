import { NextResponse } from "next/server"
import { createClient } from "../../../lib/supabase/server"

interface Params {
  params: { id: string }
}

export async function GET(req: Request, { params }: Params) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("summaries")
      .select("*")
      .eq("id", params.id)
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 200 })
  } catch (err: any) {
    console.error("Error in /api/summaries/[id]:", err)
    return NextResponse.json(
      { error: err.message || "Unexpected error" },
      { status: 500 }
    )
  }
}
