-- Adiciona a coluna background_color na tabela quality_posts
ALTER TABLE quality_posts 
ADD COLUMN IF NOT EXISTS background_color TEXT DEFAULT '#1a1a2e';
