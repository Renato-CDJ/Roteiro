import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ocxecywltreejuinbuue.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jeGVjeXdsdHJlZWp1aW5idXVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjgwMTA5NSwiZXhwIjoyMDkyMzc3MDk1fQ.IZzfhz4B0yuNtknn8vhOW0HP4xTqJBddL1iyNibTn4k'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkUsers() {
  console.log('[v0] Verificando usuarios no banco...')
  
  // Verificar se a tabela users existe e tem dados
  const { data: users, error } = await supabase
    .from('users')
    .select('id, username, email, name, role, admin_type, is_active')
    .eq('role', 'admin')
  
  if (error) {
    console.log('[v0] Erro ao buscar usuarios:', error.message)
    return
  }
  
  console.log('[v0] Admins encontrados:', users?.length || 0)
  if (users && users.length > 0) {
    users.forEach(u => {
      console.log(`  - ${u.username} | ${u.email} | ${u.role} | ${u.admin_type} | ativo: ${u.is_active}`)
    })
  } else {
    console.log('[v0] Nenhum admin encontrado! Execute o DATABASE_SETUP.sql primeiro.')
  }
  
  // Buscar especificamente pelo email admin@gruporoveri.com
  const { data: admin, error: adminError } = await supabase
    .from('users')
    .select('*')
    .ilike('email', 'admin@gruporoveri.com')
    .single()
  
  if (adminError) {
    console.log('[v0] Erro ao buscar admin@gruporoveri.com:', adminError.message)
  } else {
    console.log('[v0] Admin encontrado:')
    console.log('  - ID:', admin.id)
    console.log('  - Email:', admin.email)
    console.log('  - Password:', admin.password)
    console.log('  - Role:', admin.role)
    console.log('  - is_active:', admin.is_active)
  }
}

checkUsers()
