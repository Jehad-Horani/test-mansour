import { updateSession } from "@/lib/supabase/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

export async function middleware(request: NextRequest) {
  // أولاً حدث الجلسة
  const res = await updateSession(request);
  const supabase = createClient();

  const token = request.cookies.get("sb-access-token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const { data: { user } } = await supabase.auth.getUser(token);

  if (!user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single();

  if (error || profile?.subscription_tier !== "premium") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return res; // ترجع نتيجة updateSession بعد التحقق
}
// تحدد الصفحات اللي بدك تحميها
export const config = {
  matcher: [
    "/dashboard/exams",
    "/dashboard/schedule",
    "/summaries/:path*"
  ],
};
