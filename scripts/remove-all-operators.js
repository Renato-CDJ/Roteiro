const SUPABASE_URL = 'https://ocxecywltreejuinbuue.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jeGVjeXdsdHJlZWp1aW5idXVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjgwMTA5NSwiZXhwIjoyMDkyMzc3MDk1fQ.IZzfhz4B0yuNtknn8vhOW0HP4xTqJBddL1iyNibTn4k';

async function removeAllOperators() {
  console.log('=== Removendo todos os operadores ===\n');

  // Primeiro, contar quantos operadores existem
  const countResponse = await fetch(
    `${SUPABASE_URL}/rest/v1/users?role=eq.operator&select=id`,
    {
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      },
    }
  );

  const operators = await countResponse.json();
  console.log(`Total de operadores encontrados: ${operators.length}`);

  if (operators.length === 0) {
    console.log('Nenhum operador para remover.');
    return;
  }

  // Deletar todos os operadores
  console.log('\nRemovendo operadores...');
  
  const deleteResponse = await fetch(
    `${SUPABASE_URL}/rest/v1/users?role=eq.operator`,
    {
      method: 'DELETE',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Prefer': 'return=representation',
      },
    }
  );

  if (deleteResponse.ok) {
    const deleted = await deleteResponse.json();
    console.log(`\n${deleted.length} operadores removidos com sucesso!`);
  } else {
    const error = await deleteResponse.text();
    console.error('Erro ao remover operadores:', error);
  }

  // Verificar contagem final
  const finalCountResponse = await fetch(
    `${SUPABASE_URL}/rest/v1/users?role=eq.operator&select=id`,
    {
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      },
    }
  );

  const remainingOperators = await finalCountResponse.json();
  console.log(`\nOperadores restantes: ${remainingOperators.length}`);
}

removeAllOperators().catch(console.error);
