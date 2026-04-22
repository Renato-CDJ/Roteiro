// Script para verificar administradores no banco de dados
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ocxecywltreejuinbuue.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jeGVjeXdsdHJlZWp1aW5idXVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjgwMTA5NSwiZXhwIjoyMDkyMzc3MDk1fQ.IZzfhz4B0yuNtknn8vhOW0HP4xTqJBddL1iyNibTn4k'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkAdmins() {
  console.log('=== Verificando usuários no banco de dados ===\n')

  // Buscar todos os usuários
  const { data: allUsers, error: allError } = await supabase
    .from('users')
    .select('id, email, username, name, role, admin_type, is_active, created_at')
    .order('created_at', { ascending: true })

  if (allError) {
    console.error('Erro ao buscar usuários:', allError)
    return
  }

  console.log(`Total de usuários: ${allUsers?.length || 0}\n`)

  if (allUsers && allUsers.length > 0) {
    console.log('--- Todos os usuários ---')
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`)
      console.log(`   Username: ${user.username}`)
      console.log(`   Nome: ${user.name}`)
      console.log(`   Role: ${user.role}`)
      console.log(`   Admin Type: ${user.admin_type || 'N/A'}`)
      console.log(`   Ativo: ${user.is_active}`)
      console.log('')
    })
  }

  // Buscar apenas admins
  const { data: admins, error: adminError } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'admin')

  if (adminError) {
    console.error('Erro ao buscar admins:', adminError)
    return
  }

  console.log('\n--- Administradores ---')
  if (admins && admins.length > 0) {
    admins.forEach((admin) => {
      console.log(`Email: ${admin.email}`)
      console.log(`Role: ${admin.role}`)
      console.log(`Admin Type: ${admin.admin_type}`)
      console.log(`Senha definida: ${admin.password ? 'Sim' : 'Não'}`)
      console.log('')
    })
  } else {
    console.log('NENHUM ADMINISTRADOR ENCONTRADO!')
  }

  // Buscar supervisores também
  const { data: supervisors, error: supError } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'supervisor')

  console.log('\n--- Supervisores ---')
  if (supervisors && supervisors.length > 0) {
    supervisors.forEach((sup) => {
      console.log(`Email: ${sup.email}`)
      console.log(`Role: ${sup.role}`)
      console.log(`Senha definida: ${sup.password ? 'Sim' : 'Não'}`)
      console.log('')
    })
  } else {
    console.log('Nenhum supervisor encontrado')
  }

  // Verificar emails que contêm "admin" ou padrões similares
  console.log('\n--- Verificando padrões de email admin ---')
  const adminPatterns = ['admin', 'monitoria', 'supervisor', 'qualidade']
  
  for (const pattern of adminPatterns) {
    const { data: patternUsers, error: patternError } = await supabase
      .from('users')
      .select('email, role, is_active')
      .ilike('email', `%${pattern}%`)

    if (patternUsers && patternUsers.length > 0) {
      console.log(`\nEmails contendo "${pattern}":`)
      patternUsers.forEach(u => {
        console.log(`  - ${u.email} (role: ${u.role}, ativo: ${u.is_active})`)
      })
    } else {
      console.log(`Nenhum email contendo "${pattern}"`)
    }
  }
}

checkAdmins().catch(console.error)
