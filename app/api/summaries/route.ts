import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("summaries")
    .select(`
      *,
      profiles:user_id (
        name
      )
    `)
    .order("created_at", { ascending: false })

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

  return new Response(JSON.stringify(data))
}
