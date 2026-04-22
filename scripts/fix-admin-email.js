// Script para corrigir o email do admin no banco de dados
// Atualiza admin@empresa.com para admin@gruporoveri.com

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ocxecywltreejuinbuue.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jeGVjeXdsdHJlZWp1aW5idXVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjgwMTA5NSwiZXhwIjoyMDkyMzc3MDk1fQ.IZzfhz4B0yuNtknn8vhOW0HP4xTqJBddL1iyNibTn4k";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixAdminEmail() {
  console.log("=== CORRIGINDO EMAIL DO ADMIN ===\n");

  // 1. Verificar admins atuais
  console.log("1. Verificando admins atuais...\n");
  const { data: admins, error: fetchError } = await supabase
    .from("users")
    .select("id, username, email, role, admin_type")
    .eq("role", "admin")
    .order("email");

  if (fetchError) {
    console.error("Erro ao buscar admins:", fetchError);
    return;
  }

  console.log("Admins encontrados:");
  admins.forEach((admin) => {
    console.log(`  - ${admin.email} (${admin.admin_type || "sem tipo"})`);
  });

  // 2. Verificar se existe admin@empresa.com
  const adminEmpresa = admins.find((a) => a.email === "admin@empresa.com");

  if (adminEmpresa) {
    console.log("\n2. Encontrado admin@empresa.com - Corrigindo...\n");

    // Verificar se ja existe admin@gruporoveri.com
    const adminGrupo = admins.find((a) => a.email === "admin@gruporoveri.com");

    if (adminGrupo) {
      // Se ja existe admin@gruporoveri.com, deletar o admin@empresa.com
      console.log("   admin@gruporoveri.com ja existe, removendo admin@empresa.com...");
      const { error: deleteError } = await supabase
        .from("users")
        .delete()
        .eq("email", "admin@empresa.com");

      if (deleteError) {
        console.error("   Erro ao deletar:", deleteError);
      } else {
        console.log("   admin@empresa.com removido com sucesso!");
      }
    } else {
      // Atualizar o email
      console.log("   Atualizando email para admin@gruporoveri.com...");
      const { error: updateError } = await supabase
        .from("users")
        .update({ email: "admin@gruporoveri.com" })
        .eq("email", "admin@empresa.com");

      if (updateError) {
        console.error("   Erro ao atualizar:", updateError);
      } else {
        console.log("   Email atualizado com sucesso!");
      }
    }
  } else {
    console.log("\n2. admin@empresa.com NAO encontrado (ja corrigido ou nunca existiu)");
  }

  // 3. Verificar se admin@gruporoveri.com existe agora
  console.log("\n3. Verificando admin@gruporoveri.com...\n");
  const { data: adminCheck, error: checkError } = await supabase
    .from("users")
    .select("id, username, email, role, admin_type, password")
    .eq("email", "admin@gruporoveri.com")
    .single();

  if (checkError || !adminCheck) {
    console.log("   admin@gruporoveri.com NAO existe - Criando...");

    const { error: insertError } = await supabase.from("users").insert({
      username: "admin",
      name: "Administrador Master",
      email: "admin@gruporoveri.com",
      password: "rcp@$",
      role: "admin",
      admin_type: "master",
      is_active: true,
    });

    if (insertError) {
      console.error("   Erro ao criar:", insertError);
    } else {
      console.log("   admin@gruporoveri.com criado com sucesso!");
    }
  } else {
    console.log("   admin@gruporoveri.com existe:");
    console.log(`   - ID: ${adminCheck.id}`);
    console.log(`   - Username: ${adminCheck.username}`);
    console.log(`   - Role: ${adminCheck.role}`);
    console.log(`   - Admin Type: ${adminCheck.admin_type}`);
    console.log(`   - Senha: ${adminCheck.password ? "configurada" : "NAO CONFIGURADA"}`);
  }

  // 4. Listar todos os admins finais
  console.log("\n=== ADMINS FINAIS ===\n");
  const { data: finalAdmins } = await supabase
    .from("users")
    .select("email, role, admin_type, is_active")
    .eq("role", "admin")
    .order("email");

  finalAdmins?.forEach((admin) => {
    const status = admin.is_active ? "ATIVO" : "INATIVO";
    console.log(`  ${admin.email} - ${admin.admin_type || "sem tipo"} [${status}]`);
  });

  console.log("\n=== CORRECAO CONCLUIDA ===");
}

fixAdminEmail().catch(console.error);
