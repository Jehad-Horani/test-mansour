import { createClient } from "../../../lib/supabase/server"

export async function POST(req: Request) {
  const { lectureId, userId } = await req.json()
  const supabase = await createClient()

  const { error } = await supabase
    .from("daily_lectures")
    .update({
      status: "approved",
      approved_by: userId,
      approved_at: new Date().toISOString(),
    })
    .eq("id", lectureId)

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

  await supabase.from("admin_actions").insert({
    admin_id: userId,
    action_type: "approve_lecture",
    target_type: "daily_lecture",
    target_id: lectureId,
    reason: "محاضرة يومية معتمدة",
  })

  return new Response(JSON.stringify({ success: true }))
}
