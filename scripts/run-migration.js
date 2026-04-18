import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xyfagwyqkhsqhirzkunz.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.argv[2]

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Pass service role key as argument.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function addBackgroundColorColumn() {
  console.log('Adding background_color column to quality_posts table...')
  
  const { error } = await supabase.rpc('exec_sql', {
    sql: `ALTER TABLE quality_posts ADD COLUMN IF NOT EXISTS background_color TEXT DEFAULT '#1a1a2e';`
  })

  if (error) {
    // Se o RPC não existir, tenta via query direta
    console.log('RPC não disponível, tentando via REST...')
    
    const { error: error2 } = await supabase
      .from('quality_posts')
      .select('background_color')
      .limit(1)
    
    if (error2 && error2.message.includes('does not exist')) {
      console.error('A coluna background_color não existe. Execute o seguinte SQL no Supabase Dashboard:')
      console.log(`
ALTER TABLE quality_posts 
ADD COLUMN IF NOT EXISTS background_color TEXT DEFAULT '#1a1a2e';
      `)
    } else if (!error2) {
      console.log('A coluna background_color já existe!')
    } else {
      console.error('Erro:', error2.message)
    }
  } else {
    console.log('Coluna adicionada com sucesso!')
  }
}

addBackgroundColorColumn()
