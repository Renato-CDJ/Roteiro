import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

async function testConnection() {
  console.log("=== Teste de Conexão com Supabase ===\n")

  // Verificar variáveis de ambiente
  console.log("1. Verificando variáveis de ambiente...")
  if (!supabaseUrl) {
    console.error("   ❌ NEXT_PUBLIC_SUPABASE_URL não está definida")
    return
  }
  console.log("   ✅ NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl)

  if (!supabaseAnonKey) {
    console.error("   ❌ NEXT_PUBLIC_SUPABASE_ANON_KEY não está definida")
    return
  }
  console.log("   ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: [definida]")

  if (!supabaseServiceKey) {
    console.warn("   ⚠️ SUPABASE_SERVICE_ROLE_KEY não está definida (opcional para client-side)")
  } else {
    console.log("   ✅ SUPABASE_SERVICE_ROLE_KEY: [definida]")
  }

  // Testar conexão com cliente anônimo
  console.log("\n2. Testando conexão com cliente anônimo...")
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Tentar listar tabelas públicas
    const { data, error } = await supabase
      .from("users")
      .select("count")
      .limit(1)

    if (error) {
      // Se a tabela não existir, ainda assim a conexão funcionou
      if (error.code === "42P01" || error.message.includes("does not exist")) {
        console.log("   ✅ Conexão estabelecida com sucesso!")
        console.log("   ℹ️ Tabela 'users' não existe ainda (isso é esperado em um banco novo)")
      } else if (error.code === "PGRST301") {
        console.log("   ✅ Conexão estabelecida com sucesso!")
        console.log("   ℹ️ Acesso negado por RLS (Row Level Security ativo)")
      } else {
        console.error("   ❌ Erro na query:", error.message)
      }
    } else {
      console.log("   ✅ Conexão estabelecida e query executada com sucesso!")
      console.log("   📊 Dados recebidos:", data)
    }
  } catch (e) {
    console.error("   ❌ Erro ao conectar:", e)
    return
  }

  // Testar conexão com service role (se disponível)
  if (supabaseServiceKey) {
    console.log("\n3. Testando conexão com Service Role...")
    try {
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })

      // Listar tabelas existentes
      const { data: tables, error } = await supabaseAdmin
        .from("information_schema.tables")
        .select("table_name")
        .eq("table_schema", "public")
        .limit(10)

      if (error) {
        // Tentar uma query simples
        const { error: healthError } = await supabaseAdmin.from("users").select("count").limit(1)

        if (healthError && healthError.code !== "42P01") {
          console.error("   ❌ Erro:", healthError.message)
        } else {
          console.log("   ✅ Conexão admin estabelecida com sucesso!")
        }
      } else {
        console.log("   ✅ Conexão admin estabelecida com sucesso!")
        console.log("   📋 Tabelas encontradas:", tables?.map((t: any) => t.table_name).join(", ") || "nenhuma")
      }
    } catch (e) {
      console.error("   ❌ Erro ao conectar com admin:", e)
    }
  }

  console.log("\n=== Teste concluído ===")
}

testConnection().catch(console.error)
