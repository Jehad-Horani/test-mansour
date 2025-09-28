// api/summaries/route.ts
import { NextResponse } from "next/server"
import { createAdminClient, authServer } from "@/lib/supabase/server"

export async function GET() {
  try {
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
        is_approved,
        created_at,
        user_id,
        user_name,
        rejection_reason
      `)
      .order("created_at", { ascending: false })

    if (error) throw error

    // نتاكد انه status موجود دايمًا
    const summaries = data.map((s) => ({
      ...s,
      status: s.status || (s.is_approved ? "approved" : "pending"),
    }))

    return NextResponse.json(summaries)
  } catch (err) {
    console.error("Error fetching summaries:", err)
    return NextResponse.json({ error: "فشل في جلب الملخصات" }, { status: 500 })
  }
}
