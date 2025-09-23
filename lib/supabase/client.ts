import { createBrowserClient } from "@supabase/ssr"

let client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  // Reuse the same client instance for better performance
  if (client) return client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[v0] Client - Missing Supabase environment variables")
    console.error("URL:", supabaseUrl ? "✓" : "✗")
    console.error("Key:", supabaseAnonKey ? "✓" : "✗")
    throw new Error("Missing Supabase environment variables")
  }

  // Remove the cookies configuration to use document.cookie API automatically
  client = createBrowserClient(supabaseUrl, supabaseAnonKey)

  return client
}

