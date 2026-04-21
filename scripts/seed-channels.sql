-- ============================================================
-- SEED: CANAIS
-- Dados de exemplo para a tabela channels
-- ============================================================

INSERT INTO channels (name, description, icon, is_active) VALUES
('Telefone', 'Ligação telefônica tradicional', 'phone', true),
('WhatsApp', 'Mensagem via WhatsApp', 'message-circle', true),
('E-mail', 'Contato por e-mail', 'mail', true),
('SMS', 'Mensagem de texto SMS', 'smartphone', true),
('Chat Online', 'Chat no site da empresa', 'message-square', true),
('Presencial', 'Atendimento presencial', 'users', true),
('Redes Sociais', 'Contato via redes sociais', 'share-2', true),
('Video Chamada', 'Atendimento por vídeo', 'video', true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- FIM DO SEED
-- ============================================================
