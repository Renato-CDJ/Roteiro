const SUPABASE_URL = "https://ocxecywltreejuinbuue.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jeGVjeXdsdHJlZWp1aW5idXVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjgwMTA5NSwiZXhwIjoyMDkyMzc3MDk1fQ.IZzfhz4B0yuNtknn8vhOW0HP4xTqJBddL1iyNibTn4k"

async function checkAdminDetails() {
  console.log("=== Detalhes dos usuarios admin ===\n")
  
  const response = await fetch(`${SUPABASE_URL}/rest/v1/users?role=eq.admin&select=id,email,username,name,role,admin_type,password,is_active`, {
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json"
    }
  })
  
  const admins = await response.json()
  
  console.log(`Encontrados ${admins.length} admins:\n`)
  
  for (const admin of admins) {
    console.log(`Email: ${admin.email}`)
    console.log(`  Username: ${admin.username}`)
    console.log(`  Nome: ${admin.name}`)
    console.log(`  Role: ${admin.role}`)
    console.log(`  Admin Type: ${admin.admin_type}`)
    console.log(`  Senha configurada: ${admin.password ? "Sim (" + admin.password + ")" : "NAO"}`)
    console.log(`  Ativo: ${admin.is_active}`)
    console.log("")
  }
}

checkAdminDetails().catch(console.error)
