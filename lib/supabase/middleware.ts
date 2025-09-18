import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[v0] Middleware - Missing Supabase environment variables")
    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
      },
    },
  })

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
    if (user) {
      console.log("[v0] Middleware - User:", `✓ ${user.email}`)
    }
  } catch (error) {
    console.error("[v0] Middleware - Error getting user:", error)
  }

  const { pathname } = request.nextUrl

  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/profile", "/market/sell", "/summaries/upload", "/market/messages"]
  const adminRoutes = ["/admin"]
  const authRoutes = ["/auth/login", "/auth/register"]

  // Redirect authenticated users away from auth pages
  if (user && authRoutes.some((route) => pathname.startsWith(route))) {
    // Get user profile to check role
    try {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

      const redirectUrl = profile?.role === "admin" ? "/admin" : "/dashboard"
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    } catch (error) {
      console.error("[v0] Middleware - Error getting profile:", error)
    }
  }

  // Protect admin routes
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    try {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

      if (profile?.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    } catch (error) {
      console.error("[v0] Middleware - Error checking admin role:", error)
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  }

  // Protect other authenticated routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  }

  return supabaseResponse
}
