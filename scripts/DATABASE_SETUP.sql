-- ============================================================
-- REPIR - ROTEIRO CALL CENTER
-- SETUP COMPLETO DO BANCO DE DADOS
-- 
-- Copie e cole este script INTEIRO no SQL Editor do Supabase
-- Versao: 4.0 - Consolidado e Limpo
-- Data: 2025
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. TABELA DE USUARIOS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) DEFAULT '',
  role VARCHAR(50) NOT NULL DEFAULT 'operator' CHECK (role IN ('admin', 'operator', 'supervisor')),
  admin_type VARCHAR(50) CHECK (admin_type IN ('master', 'monitoria', 'supervisao')),
  allowed_tabs TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  is_online BOOLEAN DEFAULT false,
  avatar_url TEXT,
  last_activity TIMESTAMPTZ,
  current_product TEXT,
  current_screen TEXT,
  last_script_access TIMESTAMPTZ,
  last_login TIMESTAMPTZ,
  last_seen TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices para busca
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ============================================================
-- 2. TABELA DE PRODUTOS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT DEFAULT '',
  price NUMERIC DEFAULT 0,
  details JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. TABELA DE ROTEIROS/SCRIPTS
-- ============================================================
CREATE TABLE IF NOT EXISTS scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  category TEXT DEFAULT '',
  product_id TEXT,
  product_name TEXT,
  step_order INTEGER DEFAULT 0,
  buttons JSONB DEFAULT '[]',
  tabulations JSONB DEFAULT '[]',
  alert JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. TABELA DE TABULACOES
-- ============================================================
CREATE TABLE IF NOT EXISTS tabulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  color TEXT DEFAULT '#6b7280',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. TABELA DE SITUACOES
-- ============================================================
CREATE TABLE IF NOT EXISTS situations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  color TEXT DEFAULT '#6b7280',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. TABELA DE CANAIS
-- ============================================================
CREATE TABLE IF NOT EXISTS channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  icon TEXT DEFAULT 'phone',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. TABELA DE CODIGOS DE RESULTADO
-- ============================================================
CREATE TABLE IF NOT EXISTS result_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT DEFAULT '',
  color TEXT DEFAULT '#6b7280',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 8. TABELA DE GUIA INICIAL
-- ============================================================
CREATE TABLE IF NOT EXISTS initial_guide (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  step_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 9. TABELA DE FRASEOLOGIA
-- ============================================================
CREATE TABLE IF NOT EXISTS phraseology (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  category TEXT DEFAULT '',
  shortcut TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 10. TABELA DE CONFIGURACOES
-- ============================================================
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value JSONB,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 11. TABELA DE MENSAGENS (RECADOS DO ADMIN)
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  priority TEXT DEFAULT 'normal',
  author_id TEXT,
  author_name TEXT,
  recipients TEXT[] DEFAULT '{}',
  send_to_all BOOLEAN DEFAULT true,
  seen_by TEXT[] DEFAULT '{}',
  segments JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 12. TABELA DE TENTATIVAS DE QUIZ
-- ============================================================
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID,
  post_id UUID,
  user_id TEXT NOT NULL,
  selected_answer TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 13. TABELA DE FEEDBACKS
-- ============================================================
CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  content TEXT,
  message TEXT,
  type TEXT DEFAULT 'positive',
  sender_id TEXT,
  sender_name TEXT,
  recipient_id TEXT,
  recipient_name TEXT,
  operator_id UUID,
  operator_name TEXT,
  status TEXT DEFAULT 'pending',
  score INTEGER DEFAULT 0,
  is_read BOOLEAN DEFAULT false,
  created_by UUID,
  created_by_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 14. TABELA DE POSTS DA CENTRAL DE QUALIDADE
-- ============================================================
CREATE TABLE IF NOT EXISTS quality_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL CHECK (type IN ('comunicado', 'quiz', 'recado', 'pergunta', 'feedback', 'aviso', 'procedimento', 'dica')),
  content TEXT NOT NULL,
  author_id TEXT,
  author_name VARCHAR(255) NOT NULL,
  quiz_options JSONB,
  correct_option INTEGER,
  likes TEXT[] DEFAULT '{}',
  is_pinned BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  recipients TEXT[] DEFAULT '{}',
  recipient_names TEXT[] DEFAULT '{}',
  send_to_all BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 15. TABELA DE COMENTARIOS DA CENTRAL DE QUALIDADE
-- ============================================================
CREATE TABLE IF NOT EXISTS quality_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES quality_posts(id) ON DELETE CASCADE,
  author_id TEXT,
  author_name VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 16. TABELA DE PERGUNTAS PARA ADMIN
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  author_id TEXT NOT NULL,
  author_name TEXT,
  reply TEXT,
  replied_by TEXT,
  replied_by_name TEXT,
  replied_at TIMESTAMPTZ,
  second_reply TEXT,
  second_replied_at TIMESTAMPTZ,
  reply_count INTEGER DEFAULT 0,
  understood BOOLEAN,
  needs_in_person_feedback BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 17. TABELA DE MENSAGENS DE CHAT
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
  sender_name TEXT NOT NULL,
  recipient_id UUID REFERENCES users(id) ON DELETE SET NULL,
  recipient_name TEXT,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  is_read BOOLEAN DEFAULT false,
  is_global BOOLEAN DEFAULT false,
  is_edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 18. TABELA DE CHAT COM SUPERVISORES
-- ============================================================
CREATE TABLE IF NOT EXISTS supervisor_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  recipient_id TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMPTZ,
  reply_to_id UUID,
  reply_to_sender_name TEXT,
  reply_to_content TEXT,
  attachment_url TEXT,
  attachment_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 19. TABELA DE CHAT COM QUALIDADE
-- ============================================================
CREATE TABLE IF NOT EXISTS quality_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  recipient_id TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMPTZ,
  reply_to_id UUID,
  reply_to_sender_name TEXT,
  reply_to_content TEXT,
  attachment_url TEXT,
  attachment_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDICES ADICIONAIS PARA PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_quality_posts_type ON quality_posts(type);
CREATE INDEX IF NOT EXISTS idx_quality_posts_author ON quality_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_quality_posts_created ON quality_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_questions_author ON admin_questions(author_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_recipient ON feedbacks(recipient_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_recipient ON chat_messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_supervisor_chat_sender ON supervisor_chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_quality_chat_sender ON quality_chat_messages(sender_id);

-- ============================================================
-- INSERIR USUARIO ADMIN PADRAO
-- ============================================================
INSERT INTO users (username, name, email, password, role, admin_type, is_active)
VALUES ('admin', 'Administrador', 'admin@empresa.com', 'admin123', 'admin', 'master', true)
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- FIM DO SCRIPT
-- ============================================================
