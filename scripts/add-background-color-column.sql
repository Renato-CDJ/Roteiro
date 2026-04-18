-- ============================================================
-- MIGRAÇÃO: Adicionar coluna background_color na tabela quality_posts
-- Data: 2026-04-18
-- ============================================================

-- Adicionar coluna background_color para permitir customização de cores nos posts
ALTER TABLE quality_posts 
ADD COLUMN IF NOT EXISTS background_color VARCHAR(50) DEFAULT NULL;

-- Comentário para documentação
COMMENT ON COLUMN quality_posts.background_color IS 'Cor de fundo personalizada do post (hex ou nome de cor)';
