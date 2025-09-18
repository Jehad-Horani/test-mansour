import { createClient } from "../../../lib/supabase/server"

export async function POST(req: Request) {
  const { password } = await req.json()
  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

  return new Response(JSON.stringify({ success: true }))
}
