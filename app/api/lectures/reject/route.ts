import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const { lectureId, rejectionReason, userId } = await req.json()
  const supabase = await createClient()

  const { error } = await supabase
    .from("daily_lectures")
    .update({
      status: "rejected",
      rejection_reason: rejectionReason,
      approved_by: userId,
      approved_at: new Date().toISOString(),
    })
    .eq("id", lectureId)

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

  await supabase.from("admin_actions").insert({
    admin_id: userId,
    action_type: "reject_lecture",
    target_type: "daily_lecture",
    target_id: lectureId,
    reason: rejectionReason,
  })

  return new Response(JSON.stringify({ success: true }))
}
