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

-- Operador (Acesso unico para todos os operadores - sem senha)
INSERT INTO users (username, name, email, password, role, admin_type, is_active)
VALUES ('Operador', 'Operador', 'operador@gruporoveri.com', '', 'operator', NULL, true)
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
-- INSERIR DADOS INICIAIS - CANAIS DE ATENDIMENTO CAIXA
-- ============================================================
INSERT INTO channels (name, description, icon, is_active) VALUES
('Alo CAIXA', '4004 0 104 (Capitais) / 0800 104 0 104 (Demais regioes) - PF, PJ, Ente Publico - Conta corrente, poupanca, emprestimos, cartao, habitacao, negocios, loterias', 'phone', true),
('CAIXA Cidadao', '0800 726 0207 - PIS, Beneficios Sociais, FGTS e Cartao Social - Eletronico 24h / Humano seg-sex 8h-21h, sab 10h-16h', 'phone', true),
('Agencia Digital', '4004 0 104 (Capitais) / 0800 104 0 104 (Demais) - Servicos e consultoria financeira - 8h as 18h (exceto fds e feriados)', 'building', true),
('Atendimento Surdos', 'Atendimento 24h com Interprete de Libras via ICOM - https://icom.app/8AG8Z - www.caixa.gov.br/libras', 'ear', true),
('SAC CAIXA', '0800 726 0101 - Reclamacoes, sugestoes, elogios, cancelamentos - Atendimento 24h', 'headphones', true),
('Ouvidoria CAIXA', '0800 725 7474 - Reclamacoes nao solucionadas - Dias uteis 9h as 18h', 'message-circle', true),
('Canal de Denuncias', '0800 721 0738 - Fatos irregulares contra CAIXA - 24h - https://www.caixa.gov.br/denuncia', 'alert-triangle', true),
('WhatsApp CAIXA', '0800 101 0104 - Negociacao de dividas via www.caixa.gov.br/negociar', 'message-circle', true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- INSERIR DADOS INICIAIS - SITUACOES
-- ============================================================
INSERT INTO situations (name, description, color, is_active) VALUES
('Falencia/Concordata', 'Socio ou responsavel informa que a empresa entrou em falencia. Orientar a acessar www.caixa.gov.br/negociar ou WhatsApp 0800 101 0104. Tabulacao: Recado com terceiro', '#ef4444', true),
('Falecido', 'Terceiro informa que o titular faleceu. Necessario comparecer a agencia com certidao de obito para interromper ligacoes. Tabulacao: FALECIDO', '#1f2937', true),
('LGPD - Questionamento de Dados', 'Cliente questiona sobre posse de dados. Informar Lei LGPD 13.709 e e-mail dpo@gruporoveri.com.br para duvidas', '#8b5cf6', true),
('Solicitacao de Protocolo', 'Cliente solicita protocolo. Informar que nao e SAC, ligacoes sao gravadas e solicitar na agencia de relacionamento', '#f59e0b', true),
('Nao Reside no Imovel', 'Cliente informa que nao reside no imovel. Divida em seu nome/CPF, sugerir contato com quem realiza pagamento', '#06b6d4', true),
('Solicitacao de Ligacao', 'Cliente solicita escuta da ligacao. PR/RJ/SP/MT: 7 dias uteis. Outros estados: solicitar na agencia', '#3b82f6', true),
('FIES - Pausar Pagamento', 'Cliente FIES questiona renegociacao. Orientar verificar em http://sifesweb.caixa.gov.br, APP FIES CAIXA ou agencia', '#22c55e', true),
('Emprestimo Consignado', 'Cliente questiona desconto na folha. Orientar verificar se valor foi descontado, agendar retorno se necessario', '#f97316', true),
('Divida Nao Reconhecida', 'Cliente nao reconhece a divida. Orientar procurar agencia CAIXA ou ligar 0800 101 0104. Cartao: central no verso', '#dc2626', true),
('Produto Nao Atendido', 'Produto que nao atendo. Confirmar IP, informar transferencia, transferir em Campanha Receptivo, tabular Transferencia de Ligacao', '#64748b', true),
('Atendimento CNPJ', 'Atendimento PJ. Falar nome do socio ou solicitar socio/responsavel financeiro. Verificar em Detalhes do Cliente', '#0ea5e9', true),
('SINEB 2.0', 'Oferta de renegociacao. Exclusao CPF em 10 dias uteis apos pagamento. Juros corrigidos diariamente. Condicoes nao garantidas', '#7c3aed', true),
('Lei MT 12395/2024 e RS 16276/2025', 'Cliente MT ou RS solicita composicao de valores: valor originario, juros, multas, taxas, custas, honorarios e total', '#10b981', true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- INSERIR DADOS INICIAIS - TABULACOES (CODIGO DE RESULTADO)
-- ============================================================

-- TABULACOES ANTES DA IP (Identificacao Positiva)
INSERT INTO tabulations (name, description, color, is_active) VALUES
('Ligacao Caiu', 'Atendimento interrompido sem possibilidade de confirmar CPF. Ex: Alo, Quem e, De onde fala, Sou eu, Do que se trata', '#ef4444', true),
('Ligacao Muda', 'Ligacao iniciou muda, sem fala do cliente. Ruidos ou vozes nao direcionadas = Ligacao muda', '#6b7280', true),
('Recado com Terceiro', 'Terceiro informa falencia, conhece cliente, ou pede para ligar outro dia/horario/telefone', '#f59e0b', true),
('Falecido', 'Terceiro informa que o titular faleceu', '#1f2937', true),
('Desconhecido no Telefone', 'Terceiro nao conhece ninguem com nome do cliente. Ex: Nao conheco, Nao e desse numero, Nunca ouvi falar', '#64748b', true),
('Pessoa Nao Confirma Dados', 'Cliente recusa confirmar dados: CPF nao confere, recusa informar, nao lembra, nao pode falar', '#dc2626', true),
('Falencia ou Concordata', 'Socio ou responsavel financeiro informa falencia da empresa', '#991b1b', true),
('Desconhecido', 'Terceiro nao conhece ninguem com nome do cliente no telefone cadastrado', '#71717a', true),
('Sinal de Fax', 'Ligacao direcionada para sinal de FAX', '#8b5cf6', true),
('Caixa Postal', 'Ligacao direcionada diretamente a caixa postal', '#a855f7', true)
ON CONFLICT DO NOTHING;

-- TABULACOES APOS A IP (Identificacao Positiva)
INSERT INTO tabulations (name, description, color, is_active) VALUES
('Contato Interrompido Apos IP', 'Ligacao interrompida sem posicionamento do cliente sobre a divida. Ex: Cliente responde NAO e desliga', '#f97316', true),
('Pessoa Solicita Retorno', 'Cliente pede para retornar a ligacao em outro dia/horario', '#3b82f6', true),
('Pagamento Ja Efetuado', 'Cliente informa que ja efetuou o pagamento', '#22c55e', true),
('Promessa Pagamento Sem Boleto', 'Cliente informa que ira pagar/depositar dentro de 10 dias corridos', '#10b981', true),
('Contato Sem Negociacao', 'Cliente nao pode falar e desliga, ou informa pagamento FORA dos 10 dias corridos', '#f59e0b', true),
('Sem Capacidade de Pagamento', 'Cliente sem recursos: desemprego, mudancas economicas, nao pode pagar no momento', '#ef4444', true),
('Divida Nao Reconhecida', 'Cliente alega desconhecer a divida', '#dc2626', true),
('Negociacao em Outro Canal', 'Cliente ja esta negociando em outro canal', '#06b6d4', true),
('Promessa Pagamento Com Boleto', 'Cliente solicita boleto e informa data de pagamento dentro de 10 dias corridos', '#22c55e', true),
('Aceita Acao Sem Boleto', 'Cliente aceita acao/campanha sem emissao de boleto', '#16a34a', true),
('Aceita Acao Com Boleto', 'Cliente aceita acao/campanha com emissao de boleto', '#15803d', true),
('Cliente Acordo Ativo Receptivo', 'Cliente com acordo vigente retorna no receptivo para esclarecimentos ou solicitar boleto', '#0ea5e9', true),
('Promessa Acordo Parcelamento', 'Cliente confirma pagamento parcelado do CARTAO DE CREDITO', '#2563eb', true),
('Transbordo Entre Canais', 'Atendimento iniciado em um canal precisa ser transbordado para outro canal', '#7c3aed', true),
('Recusa Acao/Campanha', 'Cliente nao aceita a acao/campanha ofertada. Motivos: Sem capacidade de pagamento | Contato sem negociacao/acordo | Negociacao em outro canal | Pessoa solicita retorno em outro momento | Divida nao reconhecida | Promessa de pagamento sem emissao de boleto | Promessa de pagamento com emissao de boleto', '#991b1b', true)
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
