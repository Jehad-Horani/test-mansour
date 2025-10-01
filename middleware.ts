import { updateSession } from "@/lib/supabase/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "./hooks/use-auth";

export async function middleware(request: NextRequest) {
  // أولاً حدث الجلسة
  const res = await updateSession(request);
  const supabase = createClient();

const {profile , user , error} = useAuth()


  if (!user) {
    return NextResponse.redirect(new URL("/", request.url));
  }


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
