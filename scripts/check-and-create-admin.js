import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ocxecywltreejuinbuue.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jeGVjeXdsdHJlZWp1aW5idXVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjgwMTA5NSwiZXhwIjoyMDkyMzc3MDk1fQ.IZzfhz4B0yuNtknn8vhOW0HP4xTqJBddL1iyNibTn4k";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAndCreateAdmin() {
  console.log("=== Verificando usuarios no banco ===\n");

  // Buscar todos os usuarios
  const { data: users, error } = await supabase
    .from("users")
    .select("id, email, name, role, admin_type, is_active")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Erro ao buscar usuarios:", error.message);
    console.log("\nPossivel causa: A tabela 'users' nao existe.");
    console.log("Voce precisa rodar o script DATABASE_SETUP.sql no Supabase primeiro.");
    return;
  }

  console.log(`Total de usuarios encontrados: ${users?.length || 0}\n`);

  if (users && users.length > 0) {
    console.log("Usuarios existentes:");
    users.forEach((u) => {
      console.log(`  - ${u.email} (${u.role}${u.admin_type ? "/" + u.admin_type : ""}) - Ativo: ${u.is_active}`);
    });
    
    // Verificar se existe admin
    const admins = users.filter(u => u.role === "admin");
    if (admins.length > 0) {
      console.log("\n--- Usuarios admin encontrados! ---");
      console.log("Voce pode logar com:");
      admins.slice(0, 3).forEach((a) => {
        console.log(`  Email: ${a.email}`);
      });
      return;
    }
  }

  console.log("\nNenhum admin encontrado. Criando usuarios administradores...\n");

  // Criar admins
  const adminUsers = [
    {
      username: "admin",
      name: "Administrador Master",
      email: "admin@gruporoveri.com",
      password: "rcp@$",
      role: "admin",
      admin_type: "master",
      is_active: true,
    },
    {
      username: "monitoria",
      name: "Equipe Monitoria",
      email: "monitoria@gruporoveri.com",
      password: "m1234@$.",
      role: "admin",
      admin_type: "monitoria",
      is_active: true,
    },
    {
      username: "supervisao",
      name: "Equipe Supervisao",
      email: "supervisao@gruporoveri.com",
      password: "s1234@$.",
      role: "admin",
      admin_type: "supervisao",
      is_active: true,
    },
  ];

  for (const user of adminUsers) {
    const { data, error: insertError } = await supabase
      .from("users")
      .upsert(user, { onConflict: "email" })
      .select();

    if (insertError) {
      console.log(`Erro ao criar ${user.email}:`, insertError.message);
    } else {
      console.log(`Criado/Atualizado: ${user.email}`);
    }
  }

  console.log("\n=== Admins criados com sucesso! ===");
  console.log("\nCredenciais de login:");
  console.log("  admin@gruporoveri.com / rcp@$");
  console.log("  monitoria@gruporoveri.com / m1234@$.");
  console.log("  supervisao@gruporoveri.com / s1234@$.");
}

checkAndCreateAdmin();
