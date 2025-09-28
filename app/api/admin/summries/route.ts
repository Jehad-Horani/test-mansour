import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export async function GET() {
  try {
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
        is_approved,
        created_at,
        user_id,
        rejection_reason,
        profiles!summaries_user_id_fkey(name)  -- لجلب اسم المستخدم
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching summaries:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // تعديل البيانات لتشمل status و user_name
    const summaries = (data || []).map((s: any) => ({
      ...s,
      status: s.is_approved === null ? "pending" : s.is_approved ? "approved" : "rejected",
      user_name: s.profiles?.name || "غير معروف"
    }))

    return NextResponse.json(summaries)
  } catch (error: any) {
    console.error("Unexpected error in GET /api/admin/summaries:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
