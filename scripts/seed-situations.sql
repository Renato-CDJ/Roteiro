-- ============================================================
-- SEED: SITUACOES
-- Dados de exemplo para a tabela situations
-- ============================================================

INSERT INTO situations (name, description, color, is_active) VALUES
('Primeira Ligação', 'Primeiro contato com o cliente', '#3b82f6', true),
('Retorno', 'Retorno de ligação agendada', '#f59e0b', true),
('Rechamada', 'Nova tentativa de contato', '#8b5cf6', true),
('Confirmação', 'Ligação para confirmar dados/venda', '#22c55e', true),
('Pós-Venda', 'Contato após conclusão da venda', '#06b6d4', true),
('Cobrança', 'Contato referente a cobrança', '#ef4444', true),
('Suporte', 'Atendimento de suporte ao cliente', '#10b981', true),
('Cancelamento', 'Solicitação de cancelamento', '#dc2626', true),
('Reativação', 'Tentativa de reativar cliente', '#7c3aed', true),
('Pesquisa', 'Pesquisa de satisfação', '#0ea5e9', true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- FIM DO SEED
-- ============================================================
