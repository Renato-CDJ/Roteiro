-- ============================================================
-- SEED: CANAIS DE ATENDIMENTO CAIXA
-- ============================================================
-- Este script insere os canais de atendimento padrão
-- Execute no SQL Editor do Supabase se precisar reinserir
-- ============================================================

-- Limpar canais existentes
DELETE FROM channels;

-- Inserir canais padrão
INSERT INTO channels (name, description, icon, is_active) VALUES

-- 1. Alô CAIXA
(
  'Alô CAIXA',
  '☎ 4004 0 104 - Capitais e Regiões Metropolitanas
☎ 0800 104 0 104 - Demais regiões

Pessoa Física, Jurídica ou Ente Público
Conta corrente, poupança e empréstimos comerciais
Cartão de Crédito
Habitação
Suporte nos sites, aplicativos e Caixa Eletrônico
Negociação de dívidas, penhor e contratos cedidos
Resultado de Loterias
De Olho na Qualidade (Minha Casa Minha Vida)',
  'phone',
  true
),

-- 2. Atendimento CAIXA Cidadão
(
  'Atendimento CAIXA Cidadão',
  '☎ 0800 726 0207

Atendimento sobre PIS, Benefícios Sociais, FGTS e Cartão Social
Atendimento eletrônico: 24h
Atendimento humano: seg a sex 8h às 21h, sábado 10h às 16h',
  'users',
  true
),

-- 3. Agência Digital
(
  'Agência Digital',
  '☎ 4004 0 104 - Capitais e regiões metropolitanas
☎ 0800 104 0 104 - Demais regiões

Serviços e consultoria financeira personalizada
Atendimento: 8h às 18h (exceto finais de semana e feriados)',
  'monitor',
  true
),

-- 4. Atendimento para Pessoas Surdas
(
  'Atendimento para Pessoas Surdas',
  'Para esclarecer suas dúvidas sobre produtos e serviços, suporte tecnológico, informações, reclamações, sugestões e elogios.

O atendimento ocorre 24 horas por dia, 7 dias por semana.

Atendimento com Intérprete de Libras: Acesse https://icom.app/8AG8Z e você será direcionado ao site da ICOM, parceiro da CAIXA.

Para saber mais sobre o atendimento, acesse www.caixa.gov.br/libras.',
  'ear',
  true
),

-- 5. SAC CAIXA
(
  'SAC CAIXA',
  '☎ 0800 726 0101

Reclamações, sugestões, elogios, cancelamentos
Atendimento 24h, todos os dias',
  'headphones',
  true
),

-- 6. Ouvidoria CAIXA
(
  'Ouvidoria CAIXA',
  '☎ 0800 725 7474

Reclamações não solucionadas
Atendimento: dias úteis, das 9h às 18h',
  'message-circle',
  true
),

-- 7. Canal de Denúncias
(
  'Canal de Denúncias',
  '☎ 0800 721 0738

Fatos irregulares contra a CAIXA e empresas do conglomerado
Atendimento especializado 24h, todos os dias

Página de denúncia: https://www.caixa.gov.br/denuncia',
  'shield-alert',
  true
);

-- ============================================================
-- FIM DO SCRIPT
-- Total de Canais: 7
-- ============================================================
