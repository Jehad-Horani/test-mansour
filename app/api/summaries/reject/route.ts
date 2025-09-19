import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const { summaryId, rejectionReason } = await req.json()
  const supabase = await createClient()

  const { error } = await supabase
    .from("summaries")
    .update({
      status: "rejected",
      rejection_reason: rejectionReason,
    })
    .eq("id", summaryId)

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

  return new Response(JSON.stringify({ success: true }))
}
