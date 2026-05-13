import { createBrowserClient } from "@supabase/ssr"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function createClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("[v0] Supabase env vars ausentes:", {
      url: !!SUPABASE_URL,
      key: !!SUPABASE_ANON_KEY,
    })
    throw new Error("Variáveis de ambiente do Supabase não configuradas.")
  }

  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

// Re-export types for convenience
export type SupabaseClient = ReturnType<typeof createClient>
