-- ============================================================
-- SEED: TABULACOES
-- Dados de exemplo para a tabela tabulations
-- ============================================================

INSERT INTO tabulations (name, description, color, is_active) VALUES
('Venda Concluída', 'Cliente fechou a compra', '#22c55e', true),
('Não Tem Interesse', 'Cliente não demonstrou interesse no produto', '#ef4444', true),
('Retornar Depois', 'Cliente pediu para retornar em outro momento', '#f59e0b', true),
('Número Errado', 'Número não pertence ao cliente', '#6b7280', true),
('Caixa Postal', 'Ligação caiu na caixa postal', '#8b5cf6', true),
('Não Atende', 'Cliente não atendeu a ligação', '#64748b', true),
('Ocupado', 'Linha ocupada', '#f97316', true),
('Desligou', 'Cliente desligou durante a ligação', '#dc2626', true),
('Agendamento', 'Agendou retorno para data específica', '#3b82f6', true),
('Sem Condições', 'Cliente sem condições financeiras no momento', '#71717a', true),
('Já É Cliente', 'Cliente já possui o produto/serviço', '#06b6d4', true),
('Falecido', 'Titular falecido', '#1f2937', true),
('Pediu Exclusão', 'Cliente pediu para ser excluído da lista', '#991b1b', true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- FIM DO SEED
-- ============================================================
