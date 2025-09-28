import { NextResponse } from "next/server"
import { createAdminClient, authServer } from "@/lib/supabase/server"

export async function GET() {
  await authServer.requireAdmin()

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("summaries")
    .select(`
      id,
      title,
      subject_name,
      university_name,
      semester,
      college,
      major,
      file_url,
      file_name,
      file_size,
      status,
      created_at,
      user_id,
      user_name,
      rejection_reason
    `)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const enrichedData = data?.map((summary) => ({
    ...summary,
    status: summary.status || "pending",
  }))

  return NextResponse.json(enrichedData)
}
