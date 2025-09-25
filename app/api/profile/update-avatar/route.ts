import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export async function POST(req: Request) {
  try {
    // التحقق من الـ Bearer token المرسل من المتصفح
    const authHeader = req.headers.get("authorization") || "";
    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) {
      return NextResponse.json({ success: false, error: "Missing auth token" }, { status: 401 });
    }

    // نتحقق من التوكين ونجيب بيانات اليوزر
    const {
      data: { user },
      error: userError
    } = await supabaseAdmin.auth.getUser(accessToken);

    if (userError || !user) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const { avatar_url } = body;
    if (!avatar_url) return NextResponse.json({ success: false, error: "Missing avatar_url" }, { status: 400 });

    // نعمل التحديث باستخدام service_role (يتخطى RLS لذلك نتحقق من التوكين يدويًا فوق)
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update({ avatar_url, updated_at: new Date().toISOString() })
      .eq("id", user.id);

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || String(err) }, { status: 500 });
  }
}
