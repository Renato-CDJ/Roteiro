-- Script para inserir tabulações padrão
-- Execute este script no Supabase SQL Editor se precisar reinserir os dados

-- Limpar tabulações existentes (opcional)
DELETE FROM tabulations;

-- Inserir tabulações padrão
INSERT INTO tabulations (name, description, color, is_active) VALUES
('PESSOA NÃO CONFIRMA OS DADOS', 'Pessoa informa os números do CPF, porém os dados não conferem com os números registrados no CRM ou a pessoa se recusa a informar os números do CPF para realização da identificação positiva ou pessoa não.', '#6b7280', true),
('RECADO COM TERCEIRO', 'Terceiro/cliente informa que a empresa entrou em falência/concordata ou terceiro informa que conhece o cliente, anota o recado ou não, ou terceiro pede para ligar outro dia/horário ou em outro telefone.', '#8b5cf6', true),
('FALECIDO', 'Terceiro informa que o titular faleceu.', '#1f2937', true),
('FALÊNCIA OU CONCORDATA', 'Utilizamos quando o sócio ou responsável financeiro informar que a empresa entrou em falência.', '#dc2626', true),
('DESCONHECIDO', 'Terceiro informa que não conhece ninguém com o nome do cliente no telefone do cadastro. Exemplo: "Não conheço" / "Não é desse número" / "Não é daqui" / "Nunca ouvi falar" / etc.', '#f59e0b', true),
('CONTATO SEM NEGOCIAÇÃO', 'Cliente impossibilitado de falar no momento, faz promessa de pagamento para uma data que ultrapassa o período permitido (data definida para ações especiais, data fixa de boleto, etc). Ou informa que não se lembra se foi feito o pagamento ou débito.', '#eab308', true),
('PESSOA SOLICITA RETORNO EM OUTRO MOMENTO', 'Cliente pede para o operador retornar a ligação em outro dia/horário.', '#3b82f6', true),
('PAGAMENTO JÁ EFETUADO', 'Cliente informa que já efetuou o pagamento.', '#22c55e', true),
('RECUSA AÇÃO/CAMPANHA', 'Cliente não aceita a ação/campanha ofertada.', '#ef4444', true),
('TRANSBORDO PARA ATENDIMENTO ENTRE CANAIS', 'Quando o atendimento é iniciado em um canal e precisa ser transbordado para resolução por outro canal.', '#06b6d4', true),
('NEGOCIAÇÃO EM OUTRO CANAL', 'Cliente informa que já está negociando em outro canal.', '#14b8a6', true),
('SEM CONTRATO EM COBRANÇA', 'O cliente está na base da Telecobrança, mas não constam contratos ativos (em cobrança).', '#64748b', true),
('CONTATO INTERROMPIDO APÓS IP, MAS SEM RESULTADO', 'Se após identificação positiva a ligação for interrompida.', '#f97316', true),
('DÍVIDA NÃO RECONHECIDA', 'Cliente alega que desconhece a dívida.', '#a855f7', true),
('PROMESSA DE PAGAMENTO AUTORIZA INCORPORAÇÃO', 'Cliente aceita a incorporação.', '#10b981', true),
('PROMESSA DE PAGAMENTO SEM EMISSÃO DE BOLETO', 'Cliente informa que irá pagar ou depositar dentro do prazo estabelecido [10 dias corridos].', '#059669', true),
('PROMESSA DE PAGAMENTO COM EMISSÃO DE BOLETO', 'Cliente solicita boleto e informa data de pagamento dentro do período permitido [10 dias corridos].', '#047857', true),
('ACEITA AÇÃO/CAMPANHA SEM EMISSÃO DE BOLETO', 'Cliente aceita ação/campanha sem emissão de boleto.', '#16a34a', true),
('ACEITA AÇÃO/CAMPANHA COM EMISSÃO DE BOLETO', 'Cliente aceita ação/campanha com emissão de boleto.', '#15803d', true),
('CLIENTE COM ACORDO ATIVO RETORNA NO RECEPTIVO', 'Quando o cliente retorna no receptivo tendo acordo vigente para solicitar esclarecimentos ou solicitar o boleto.', '#0d9488', true),
('PROMESSA DE PAGAMENTO ACORDO DE PARCELAMENTO', 'Cliente confirma o pagamento parcelado do CARTÃO DE CRÉDITO.', '#0891b2', true),
('SINAL DE FAX', 'Ligação direcionada: sinal de FAX.', '#71717a', true),
('CAIXA POSTAL', 'Devemos utilizar quando a ligação é direcionada diretamente à caixa postal.', '#a1a1aa', true),
('LIGAÇÃO CAIU', 'Atendimento interrompido sem que seja possível continuar o diálogo entre operador e cliente e sem possibilidade de realização da confirmação do CPF. Exemplo: "Alô" / "Quem é" / "De onde fala" / "Sou eu" / "Do que se trata" / etc.', '#78716c', true),
('LIGAÇÃO MUDA', 'Utilizar se a ligação se iniciou muda, fica sem fala do cliente. Lembrando que se a pessoa atender e houver ruídos ou vozes que não se direcionar a você será considerada uma Ligação muda.', '#57534e', true),
('SEM CAPACIDADE DE PAGAMENTO', 'Cliente informa que não tem condições de efetuar o pagamento. Exemplo dos motivos: Informa que não tem recurso disponível, desemprego, mudanças econômicas ou não pode fazer o pagamento naquele momento.', '#b91c1c', true);
