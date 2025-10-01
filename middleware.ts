import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/client";

export async function middleware(req: NextRequest) {
  const supabase = createClient();

  const token = req.cookies.get("sb-access-token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const { data: { user } } = await supabase.auth.getUser(token);

  if (!user) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single();

  if (error || profile?.subscription_tier !== "premium") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// تحدد الصفحات اللي بدك تحميها
export const config = {
  matcher: [
    "/dashboard/exams",
    "/dashboard/schedule",
    "/summaries/:path*"
  ],
};
