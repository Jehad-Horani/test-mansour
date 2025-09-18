import { createClient } from "../../../lib/supabase/server"

export async function POST(req: Request) {
  const { lectureId, isFeatured } = await req.json()
  const supabase = await createClient()

  const { error } = await supabase
    .from("daily_lectures")
    .update({ is_featured: isFeatured })
    .eq("id", lectureId)

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

  return new Response(JSON.stringify({ success: true }))
}
