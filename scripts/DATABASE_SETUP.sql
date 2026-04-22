-- ============================================================
-- REPIR - ROTEIRO CALL CENTER
-- SETUP COMPLETO DO BANCO DE DADOS
-- 
-- Copie e cole este script INTEIRO no SQL Editor do Supabase
-- Versao: 5.0 - Consolidado com Usuarios Admin
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
-- 20. TABELA DE TREINAMENTOS
-- ============================================================
CREATE TABLE IF NOT EXISTS trainings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  content TEXT DEFAULT '',
  video_url TEXT,
  category TEXT DEFAULT '',
  thumbnail_url TEXT,
  duration_minutes INTEGER DEFAULT 0,
  is_required BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  created_by TEXT,
  created_by_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 21. TABELA DE VISUALIZACOES DE TREINAMENTOS
-- ============================================================
CREATE TABLE IF NOT EXISTS training_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_id UUID REFERENCES trainings(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  user_name TEXT,
  watched_at TIMESTAMPTZ DEFAULT NOW(),
  completed BOOLEAN DEFAULT false,
  progress_percent INTEGER DEFAULT 0,
  UNIQUE(training_id, user_id)
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
CREATE INDEX IF NOT EXISTS idx_trainings_category ON trainings(category);
CREATE INDEX IF NOT EXISTS idx_training_views_user ON training_views(user_id);

-- ============================================================
-- INSERIR USUARIOS ADMINISTRADORES
-- ============================================================

-- Admin Master (Acesso Total)
INSERT INTO users (username, name, email, password, role, admin_type, is_active)
VALUES ('admin', 'Administrador Master', 'admin@gruporoveri.com', 'rcp@$', 'admin', 'master', true)
ON CONFLICT (email) DO NOTHING;

-- Admin Monitoria (Equipe de Qualidade)
INSERT INTO users (username, name, email, password, role, admin_type, is_active)
VALUES ('monitoria', 'Equipe Monitoria', 'monitoria@gruporoveri.com', 'm1234@$.', 'admin', 'monitoria', true)
ON CONFLICT (email) DO NOTHING;

-- Admin Supervisao
INSERT INTO users (username, name, email, password, role, admin_type, is_active)
VALUES ('supervisao', 'Equipe Supervisao', 'supervisao@gruporoveri.com', 's1234@$.', 'admin', 'supervisao', true)
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- INSERIR USUARIOS DE MONITORIA (monitoria1 a monitoria10)
-- ============================================================
INSERT INTO users (username, name, email, password, role, admin_type, is_active) VALUES
('monitoria1', 'Monitoria 1', 'monitoria1@gruporoveri.com', 'm1234@$.', 'admin', 'monitoria', true),
('monitoria2', 'Monitoria 2', 'monitoria2@gruporoveri.com', 'm1234@$.', 'admin', 'monitoria', true),
('monitoria3', 'Monitoria 3', 'monitoria3@gruporoveri.com', 'm1234@$.', 'admin', 'monitoria', true),
('monitoria4', 'Monitoria 4', 'monitoria4@gruporoveri.com', 'm1234@$.', 'admin', 'monitoria', true),
('monitoria5', 'Monitoria 5', 'monitoria5@gruporoveri.com', 'm1234@$.', 'admin', 'monitoria', true),
('monitoria6', 'Monitoria 6', 'monitoria6@gruporoveri.com', 'm1234@$.', 'admin', 'monitoria', true),
('monitoria7', 'Monitoria 7', 'monitoria7@gruporoveri.com', 'm1234@$.', 'admin', 'monitoria', true),
('monitoria8', 'Monitoria 8', 'monitoria8@gruporoveri.com', 'm1234@$.', 'admin', 'monitoria', true),
('monitoria9', 'Monitoria 9', 'monitoria9@gruporoveri.com', 'm1234@$.', 'admin', 'monitoria', true),
('monitoria10', 'Monitoria 10', 'monitoria10@gruporoveri.com', 'm1234@$.', 'admin', 'monitoria', true)
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- INSERIR USUARIOS DE SUPERVISAO (supervisor1 a supervisor25)
-- ============================================================
INSERT INTO users (username, name, email, password, role, admin_type, is_active) VALUES
('supervisor1', 'Supervisor 1', 'supervisor1@gruporoveri.com', 's1234@$.', 'admin', 'supervisao', true),
('supervisor2', 'Supervisor 2', 'supervisor2@gruporoveri.com', 's1234@$.', 'admin', 'supervisao', true),
('supervisor3', 'Supervisor 3', 'supervisor3@gruporoveri.com', 's1234@$.', 'admin', 'supervisao', true),
('supervisor4', 'Supervisor 4', 'supervisor4@gruporoveri.com', 's1234@$.', 'admin', 'supervisao', true),
('supervisor5', 'Supervisor 5', 'supervisor5@gruporoveri.com', 's1234@$.', 'admin', 'supervisao', true),
('supervisor6', 'Supervisor 6', 'supervisor6@gruporoveri.com', 's1234@$.', 'admin', 'supervisao', true),
('supervisor7', 'Supervisor 7', 'supervisor7@gruporoveri.com', 's1234@$.', 'admin', 'supervisao', true),
('supervisor8', 'Supervisor 8', 'supervisor8@gruporoveri.com', 's1234@$.', 'admin', 'supervisao', true),
('supervisor9', 'Supervisor 9', 'supervisor9@gruporoveri.com', 's1234@$.', 'admin', 'supervisao', true),
('supervisor10', 'Supervisor 10', 'supervisor10@gruporoveri.com', 's1234@$.', 'admin', 'supervisao', true),
('supervisor11', 'Supervisor 11', 'supervisor11@gruporoveri.com', 's1234@$.', 'admin', 'supervisao', true),
('supervisor12', 'Supervisor 12', 'supervisor12@gruporoveri.com', 's1234@$.', 'admin', 'supervisao', true),
('supervisor13', 'Supervisor 13', 'supervisor13@gruporoveri.com', 's1234@$.', 'admin', 'supervisao', true),
('supervisor14', 'Supervisor 14', 'supervisor14@gruporoveri.com', 's1234@$.', 'admin', 'supervisao', true),
('supervisor15', 'Supervisor 15', 'supervisor15@gruporoveri.com', 's1234@$.', 'admin', 'supervisao', true),
('supervisor16', 'Supervisor 16', 'supervisor16@gruporoveri.com', 's1234@$.', 'admin', 'supervisao', true),
('supervisor17', 'Supervisor 17', 'supervisor17@gruporoveri.com', 's1234@$.', 'admin', 'supervisao', true),
('supervisor18', 'Supervisor 18', 'supervisor18@gruporoveri.com', 's1234@$.', 'admin', 'supervisao', true),
('supervisor19', 'Supervisor 19', 'supervisor19@gruporoveri.com', 's1234@$.', 'admin', 'supervisao', true),
('supervisor20', 'Supervisor 20', 'supervisor20@gruporoveri.com', 's1234@$.', 'admin', 'supervisao', true),
('supervisor21', 'Supervisor 21', 'supervisor21@gruporoveri.com', 's1234@$.', 'admin', 'supervisao', true),
('supervisor22', 'Supervisor 22', 'supervisor22@gruporoveri.com', 's1234@$.', 'admin', 'supervisao', true),
('supervisor23', 'Supervisor 23', 'supervisor23@gruporoveri.com', 's1234@$.', 'admin', 'supervisao', true),
('supervisor24', 'Supervisor 24', 'supervisor24@gruporoveri.com', 's1234@$.', 'admin', 'supervisao', true),
('supervisor25', 'Supervisor 25', 'supervisor25@gruporoveri.com', 's1234@$.', 'admin', 'supervisao', true)
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- INSERIR DADOS INICIAIS - CANAIS
-- ============================================================
INSERT INTO channels (name, description, icon, is_active) VALUES
('Telefone', 'Ligacao telefonica tradicional', 'phone', true),
('WhatsApp', 'Mensagem via WhatsApp', 'message-circle', true),
('E-mail', 'Contato por e-mail', 'mail', true),
('SMS', 'Mensagem de texto SMS', 'smartphone', true),
('Chat Online', 'Chat no site da empresa', 'message-square', true),
('Presencial', 'Atendimento presencial', 'users', true),
('Redes Sociais', 'Contato via redes sociais', 'share-2', true),
('Video Chamada', 'Atendimento por video', 'video', true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- INSERIR DADOS INICIAIS - SITUACOES
-- ============================================================
INSERT INTO situations (name, description, color, is_active) VALUES
('Primeira Ligacao', 'Primeiro contato com o cliente', '#3b82f6', true),
('Retorno', 'Retorno de ligacao agendada', '#f59e0b', true),
('Rechamada', 'Nova tentativa de contato', '#8b5cf6', true),
('Confirmacao', 'Ligacao para confirmar dados/venda', '#22c55e', true),
('Pos-Venda', 'Contato apos conclusao da venda', '#06b6d4', true),
('Cobranca', 'Contato referente a cobranca', '#ef4444', true),
('Suporte', 'Atendimento de suporte ao cliente', '#10b981', true),
('Cancelamento', 'Solicitacao de cancelamento', '#dc2626', true),
('Reativacao', 'Tentativa de reativar cliente', '#7c3aed', true),
('Pesquisa', 'Pesquisa de satisfacao', '#0ea5e9', true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- INSERIR DADOS INICIAIS - TABULACOES
-- ============================================================
INSERT INTO tabulations (name, description, color, is_active) VALUES
('Venda Concluida', 'Cliente fechou a compra', '#22c55e', true),
('Nao Tem Interesse', 'Cliente nao demonstrou interesse no produto', '#ef4444', true),
('Retornar Depois', 'Cliente pediu para retornar em outro momento', '#f59e0b', true),
('Numero Errado', 'Numero nao pertence ao cliente', '#6b7280', true),
('Caixa Postal', 'Ligacao caiu na caixa postal', '#8b5cf6', true),
('Nao Atende', 'Cliente nao atendeu a ligacao', '#64748b', true),
('Ocupado', 'Linha ocupada', '#f97316', true),
('Desligou', 'Cliente desligou durante a ligacao', '#dc2626', true),
('Agendamento', 'Agendou retorno para data especifica', '#3b82f6', true),
('Sem Condicoes', 'Cliente sem condicoes financeiras no momento', '#71717a', true),
('Ja E Cliente', 'Cliente ja possui o produto/servico', '#06b6d4', true),
('Falecido', 'Titular falecido', '#1f2937', true),
('Pediu Exclusao', 'Cliente pediu para ser excluido da lista', '#991b1b', true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- FIM DO SCRIPT DE SETUP
-- ============================================================
-- 
-- PROXIMOS PASSOS:
-- 1. Execute o script RLS_POLICIES.sql para habilitar Row Level Security
-- 2. Execute o script seed-operators.sql para adicionar operadores (opcional)
-- 
-- CREDENCIAIS DOS USUARIOS:
-- 
-- Admin Master:
--   Email: admin@gruporoveri.com
--   Senha: rcp@$
-- 
-- Monitoria (monitoria, monitoria1 a monitoria10):
--   Email: monitoria@gruporoveri.com (ou monitoriaX@gruporoveri.com)
--   Senha: m1234@$.
-- 
-- Supervisao (supervisao, supervisor1 a supervisor25):
--   Email: supervisao@gruporoveri.com (ou supervisorX@gruporoveri.com)
--   Senha: s1234@$.
-- 
-- ============================================================
