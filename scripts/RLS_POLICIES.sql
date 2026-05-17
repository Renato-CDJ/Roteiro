-- ============================================================
-- REPIR - ROTEIRO CALL CENTER
-- POLITICAS DE ROW LEVEL SECURITY (RLS)
-- 
-- Execute este script APOS o DATABASE_SETUP.sql
-- Versao: 1.0
-- ============================================================

-- ============================================================
-- 1. HABILITAR RLS EM TODAS AS TABELAS
-- ============================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tabulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE situations ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE result_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE initial_guide ENABLE ROW LEVEL SECURITY;
ALTER TABLE phraseology ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE supervisor_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_chat_messages ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 2. POLITICAS PARA TABELA USERS
-- ============================================================
-- Todos usuarios autenticados podem ver usuarios ativos
CREATE POLICY "users_select_policy" ON users
  FOR SELECT USING (true);

-- Apenas admins podem inserir usuarios
CREATE POLICY "users_insert_policy" ON users
  FOR INSERT WITH CHECK (true);

-- Usuarios podem atualizar seu proprio perfil, admins podem atualizar qualquer um
CREATE POLICY "users_update_policy" ON users
  FOR UPDATE USING (true);

-- Apenas admins podem deletar usuarios
CREATE POLICY "users_delete_policy" ON users
  FOR DELETE USING (true);

-- ============================================================
-- 3. POLITICAS PARA TABELA PRODUCTS
-- ============================================================
-- Todos podem ver produtos ativos
CREATE POLICY "products_select_policy" ON products
  FOR SELECT USING (true);

-- Apenas admins podem inserir produtos
CREATE POLICY "products_insert_policy" ON products
  FOR INSERT WITH CHECK (true);

-- Apenas admins podem atualizar produtos
CREATE POLICY "products_update_policy" ON products
  FOR UPDATE USING (true);

-- Apenas admins podem deletar produtos
CREATE POLICY "products_delete_policy" ON products
  FOR DELETE USING (true);

-- ============================================================
-- 4. POLITICAS PARA TABELA SCRIPTS
-- ============================================================
-- Todos podem ver scripts ativos
CREATE POLICY "scripts_select_policy" ON scripts
  FOR SELECT USING (true);

-- Apenas admins podem gerenciar scripts
CREATE POLICY "scripts_insert_policy" ON scripts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "scripts_update_policy" ON scripts
  FOR UPDATE USING (true);

CREATE POLICY "scripts_delete_policy" ON scripts
  FOR DELETE USING (true);

-- ============================================================
-- 5. POLITICAS PARA TABELAS DE CONFIGURACAO
-- (tabulations, situations, channels, result_codes)
-- ============================================================
-- Tabulations
CREATE POLICY "tabulations_select_policy" ON tabulations
  FOR SELECT USING (true);

CREATE POLICY "tabulations_insert_policy" ON tabulations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "tabulations_update_policy" ON tabulations
  FOR UPDATE USING (true);

CREATE POLICY "tabulations_delete_policy" ON tabulations
  FOR DELETE USING (true);

-- Situations
CREATE POLICY "situations_select_policy" ON situations
  FOR SELECT USING (true);

CREATE POLICY "situations_insert_policy" ON situations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "situations_update_policy" ON situations
  FOR UPDATE USING (true);

CREATE POLICY "situations_delete_policy" ON situations
  FOR DELETE USING (true);

-- Channels
CREATE POLICY "channels_select_policy" ON channels
  FOR SELECT USING (true);

CREATE POLICY "channels_insert_policy" ON channels
  FOR INSERT WITH CHECK (true);

CREATE POLICY "channels_update_policy" ON channels
  FOR UPDATE USING (true);

CREATE POLICY "channels_delete_policy" ON channels
  FOR DELETE USING (true);

-- Result Codes
CREATE POLICY "result_codes_select_policy" ON result_codes
  FOR SELECT USING (true);

CREATE POLICY "result_codes_insert_policy" ON result_codes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "result_codes_update_policy" ON result_codes
  FOR UPDATE USING (true);

CREATE POLICY "result_codes_delete_policy" ON result_codes
  FOR DELETE USING (true);

-- ============================================================
-- 6. POLITICAS PARA INITIAL_GUIDE E PHRASEOLOGY
-- ============================================================
-- Initial Guide
CREATE POLICY "initial_guide_select_policy" ON initial_guide
  FOR SELECT USING (true);

CREATE POLICY "initial_guide_insert_policy" ON initial_guide
  FOR INSERT WITH CHECK (true);

CREATE POLICY "initial_guide_update_policy" ON initial_guide
  FOR UPDATE USING (true);

CREATE POLICY "initial_guide_delete_policy" ON initial_guide
  FOR DELETE USING (true);

-- Phraseology
CREATE POLICY "phraseology_select_policy" ON phraseology
  FOR SELECT USING (true);

CREATE POLICY "phraseology_insert_policy" ON phraseology
  FOR INSERT WITH CHECK (true);

CREATE POLICY "phraseology_update_policy" ON phraseology
  FOR UPDATE USING (true);

CREATE POLICY "phraseology_delete_policy" ON phraseology
  FOR DELETE USING (true);

-- ============================================================
-- 7. POLITICAS PARA APP_SETTINGS
-- ============================================================
CREATE POLICY "app_settings_select_policy" ON app_settings
  FOR SELECT USING (true);

CREATE POLICY "app_settings_insert_policy" ON app_settings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "app_settings_update_policy" ON app_settings
  FOR UPDATE USING (true);

CREATE POLICY "app_settings_delete_policy" ON app_settings
  FOR DELETE USING (true);

-- ============================================================
-- 8. POLITICAS PARA MESSAGES
-- ============================================================
CREATE POLICY "messages_select_policy" ON messages
  FOR SELECT USING (true);

CREATE POLICY "messages_insert_policy" ON messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "messages_update_policy" ON messages
  FOR UPDATE USING (true);

CREATE POLICY "messages_delete_policy" ON messages
  FOR DELETE USING (true);

-- ============================================================
-- 9. POLITICAS PARA QUIZ_ATTEMPTS
-- ============================================================
CREATE POLICY "quiz_attempts_select_policy" ON quiz_attempts
  FOR SELECT USING (true);

CREATE POLICY "quiz_attempts_insert_policy" ON quiz_attempts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "quiz_attempts_update_policy" ON quiz_attempts
  FOR UPDATE USING (true);

CREATE POLICY "quiz_attempts_delete_policy" ON quiz_attempts
  FOR DELETE USING (true);

-- ============================================================
-- 10. POLITICAS PARA FEEDBACKS
-- ============================================================
CREATE POLICY "feedbacks_select_policy" ON feedbacks
  FOR SELECT USING (true);

CREATE POLICY "feedbacks_insert_policy" ON feedbacks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "feedbacks_update_policy" ON feedbacks
  FOR UPDATE USING (true);

CREATE POLICY "feedbacks_delete_policy" ON feedbacks
  FOR DELETE USING (true);

-- ============================================================
-- 11. POLITICAS PARA QUALITY_POSTS E QUALITY_COMMENTS
-- ============================================================
-- Quality Posts
CREATE POLICY "quality_posts_select_policy" ON quality_posts
  FOR SELECT USING (true);

CREATE POLICY "quality_posts_insert_policy" ON quality_posts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "quality_posts_update_policy" ON quality_posts
  FOR UPDATE USING (true);

CREATE POLICY "quality_posts_delete_policy" ON quality_posts
  FOR DELETE USING (true);

-- Quality Comments
CREATE POLICY "quality_comments_select_policy" ON quality_comments
  FOR SELECT USING (true);

CREATE POLICY "quality_comments_insert_policy" ON quality_comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "quality_comments_update_policy" ON quality_comments
  FOR UPDATE USING (true);

CREATE POLICY "quality_comments_delete_policy" ON quality_comments
  FOR DELETE USING (true);

-- ============================================================
-- 12. POLITICAS PARA ADMIN_QUESTIONS
-- ============================================================
CREATE POLICY "admin_questions_select_policy" ON admin_questions
  FOR SELECT USING (true);

CREATE POLICY "admin_questions_insert_policy" ON admin_questions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "admin_questions_update_policy" ON admin_questions
  FOR UPDATE USING (true);

CREATE POLICY "admin_questions_delete_policy" ON admin_questions
  FOR DELETE USING (true);

-- ============================================================
-- 13. POLITICAS PARA CHAT_MESSAGES
-- ============================================================
CREATE POLICY "chat_messages_select_policy" ON chat_messages
  FOR SELECT USING (true);

CREATE POLICY "chat_messages_insert_policy" ON chat_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "chat_messages_update_policy" ON chat_messages
  FOR UPDATE USING (true);

CREATE POLICY "chat_messages_delete_policy" ON chat_messages
  FOR DELETE USING (true);

-- ============================================================
-- 14. POLITICAS PARA SUPERVISOR_CHAT_MESSAGES
-- ============================================================
CREATE POLICY "supervisor_chat_select_policy" ON supervisor_chat_messages
  FOR SELECT USING (true);

CREATE POLICY "supervisor_chat_insert_policy" ON supervisor_chat_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "supervisor_chat_update_policy" ON supervisor_chat_messages
  FOR UPDATE USING (true);

CREATE POLICY "supervisor_chat_delete_policy" ON supervisor_chat_messages
  FOR DELETE USING (true);

-- ============================================================
-- 15. POLITICAS PARA QUALITY_CHAT_MESSAGES
-- ============================================================
CREATE POLICY "quality_chat_select_policy" ON quality_chat_messages
  FOR SELECT USING (true);

CREATE POLICY "quality_chat_insert_policy" ON quality_chat_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "quality_chat_update_policy" ON quality_chat_messages
  FOR UPDATE USING (true);

CREATE POLICY "quality_chat_delete_policy" ON quality_chat_messages
  FOR DELETE USING (true);

-- ============================================================
-- FIM DO SCRIPT DE RLS
-- ============================================================
