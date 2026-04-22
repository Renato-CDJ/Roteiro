import { createBrowserClient } from "@supabase/ssr"

// Singleton instance for client-side
let clientInstance: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (clientInstance) {
    return clientInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log("[v0] Supabase URL:", supabaseUrl ? "OK" : "MISSING")
  console.log("[v0] Supabase Anon Key:", supabaseAnonKey ? "OK" : "MISSING")

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[v0] Missing Supabase env vars:", { url: !!supabaseUrl, key: !!supabaseAnonKey })
    throw new Error(
      "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
    )
  }

  clientInstance = createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )

  return clientInstance
}

// Re-export types for convenience
export type SupabaseClient = ReturnType<typeof createClient>
