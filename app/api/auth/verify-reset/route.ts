import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const { access_token } = await req.json()
  const supabase = await createClient()

  // تحقق من الجلسة باستخدام الـ access_token
  const { data, error } = await supabase.auth.getUser(access_token)

  if (error) {
    return new Response(JSON.stringify({ error: "رابط استعادة كلمة المرور غير صحيح أو منتهي الصلاحية" }), { status: 400 })
  }

  return new Response(JSON.stringify({ user: data.user }))
}
