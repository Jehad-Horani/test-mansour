import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("daily_lectures")
    .select(`
      *,
      profiles:uploaded_by (
        name
      )
    `)
    .order("upload_date", { ascending: false })

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

  return new Response(JSON.stringify(data))
}
