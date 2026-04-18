-- ============================================================
-- SCRIPT PARA INSERIR SITUAÇÕES PADRÃO DE ATENDIMENTO
-- Execute este script no Supabase SQL Editor
-- ============================================================

-- Limpar situações existentes (opcional - descomente se quiser substituir tudo)
-- DELETE FROM situations;

-- Inserir situações padrão
INSERT INTO situations (name, description, is_active) VALUES

-- 1. Falência/Concordata
('EM CASOS DE FALÊNCIA/CONCORDATA', 
'É necessário que o sócio ou responsável entre em contato com a CAIXA acessando www.caixa.gov.br/negociar e pelo WhatsApp 0800 101 0104.

Tabulação correta: Recado com terceiro', 
true),

-- 2. Falecido
('FALECIDO', 
'Pessoa informa que o titular faleceu. É necessário que compareça à agência levando a certidão de óbito para que as ligações de cobrança sejam interrompidas.

Tabulação correta: FALECIDO', 
true),

-- 3. LGPD
('SE O CLIENTE CITAR A LGPD OU PERGUNTAR POR QUE TEMOS OS SEUS DADOS', 
'"(NOME DO CLIENTE), seguindo a lei LGPD, n°13.709, possuímos alguns dados representando a CAIXA ECONÔMICA FEDERAL, para garantir sua segurança. Caso você possua qualquer dúvida ou solicitação em relação a isso, pedimos que entre em contato conosco enviando um e-mail para: dpo@gruporoveri.com.br."

EXEMPLOS DE QUESTIONAMENTOS FEITOS PELOS CLIENTES:
- Como você possui meus dados pessoais?
- Vocês têm o direito de me ligar?
- Isso está conforme a LGPD?
- Quero que excluam meus dados!', 
true),

-- 4. Protocolo da Ligação
('O CLIENTE SOLICITA O PROTOCOLO DA LIGAÇÃO', 
'Informar que nós somos uma central de negócios, ou seja, nosso atendimento não possui caráter de SAC. Entretanto, como mencionamos no início do contato, todas as ligações são gravadas e para que você tenha acesso a elas é necessário que as solicite na sua agência de relacionamento.

POR QUE NÃO PODEMOS REPASSAR ESSA INFORMAÇÃO PARA O CLIENTE?
Nossa assessoria não é SAC.', 
true),

-- 5. Não reside no Imóvel
('SE O CLIENTE INFORMAR QUE NÃO RESIDE NO IMÓVEL', 
'Orientação - Embora o senhor(a) não resida no local, a dívida está registrada em seu nome e CPF, o que o(a) mantém como responsável pela regularização. Para resolver essa situação de forma rápida e eficiente, sugerimos que entre em contato com a pessoa que realiza o pagamento dessa dívida. Isso pode ajudar a esclarecer se o pagamento já foi efetuado, se há uma data prevista para a quitação ou outras informações relevantes.', 
true),

-- 6. Cliente solicita ligação do atendimento
('CLIENTE SOLICITOU A LIGAÇÃO DO ATENDIMENTO', 
'CASO O CONTRATO SEJA DOS ESTADOS:
PARANÁ - DDD (41, 42, 43, 44, 45 e 46)
RIO DE JANEIRO - DDD (21)
SÃO PAULO - DDD (11)
MATO GROSSO - DDD (65)

Devemos informar: "A solicitação será repassada à CAIXA para verificação e atendimento no prazo de até 7 (sete) dias úteis."

(PARA OUTROS ESTADOS)
Nesses casos, o que deve ser repassado para o cliente é: "Você pode solicitar a escuta da ligação na sua agência de relacionamento."', 
true),

-- 7. FIES - Pausar pagamento
('QUANDO O CLIENTE DO FIES DISSER QUE QUER PAUSAR O PAGAMENTO DAS SUAS PARCELAS', 
'Caso o cliente do FIES questione a possibilidade de renegociar ou solicite o desconto para seu contrato, informar:

1. "Você pode verificar se o seu contrato tem a possibilidade de realizar renegociação no site http://sifesweb.caixa.gov.br, APP FIES CAIXA ou na sua agência."

ATENÇÃO! Lembrando que essa orientação só deve ser repassada para aqueles clientes que já fizeram a confirmação positiva.', 
true),

-- 8. Empréstimo Consignado
('CONTRATOS DE EMPRÉSTIMO CONSIGNADO', 
'Devemos orientar o cliente pedindo para que ele verifique novamente se o valor foi de fato descontado da folha de pagamento. Caso ele fale que vai aguardar em linha este retorno. Se o cliente disser que não pode fazer essa verificação durante o atendimento, podemos solicitar o melhor horário e telefone para realizar um contato futuro.

QUESTIONAMENTO NORMALMENTE REALIZADO PELO CLIENTE:
"Isso é descontado na minha folha de pagamento, não está aparecendo no sistema?"', 
true),

-- 9. Não reconhece a dívida
('NÃO RECONHECE A DÍVIDA', 
'Orientações: Orientar o cliente a procurar uma agência da CAIXA para mais informações ou ligar no 0800 101 0104. Para cartão de crédito, indicar a central de atendimento que está no verso do cartão para contestação das despesas.', 
true),

-- 10. Produto que não atendo
('O QUE FAZER QUANDO CAIR UM PRODUTO QUE NÃO ATENDO?', 
'PASSO A PASSO:
1. ABORDAGEM PADRÃO;
2. CONFIRMAÇÃO DE DADOS - IDENTIFICAÇÃO POSITIVA;
3. INFORMAR AO CLIENTE: "PEÇO QUE AGUARDE UM INSTANTE QUE IREI TRANSFERIR AO SETOR RESPONSÁVEL";
4. TRANSFERIR NA SEGUNDA ABA DO WEDOO EM "CAMPANHA RECEPTIVO";
5. TABULAR: TRANSFERÊNCIA DE LIGAÇÃO.', 
true),

-- 11. Atendimento CNPJ
('O QUE FAZER QUANDO CAIR ATENDIMENTO CNPJ?', 
'ABORDAGEM PADRÃO: FALAR NOME DO SÓCIO QUE CONSTA EM DADOS DO CLIENTE;
• SE CONSTAR NOME DA EMPRESA EM DADOS DO CLIENTE, SOLICITE PARA FALAR COM SÓCIO OU RESPONSÁVEL FINANCEIRO DA EMPRESA;
• VERIFIQUE O NOME DO SÓCIO OU RESPONSÁVEL FINANCEIRO DA EMPRESA EM: DETALHES DO CLIENTE;
• SE NÃO CONSTAR ESSA INFORMAÇÃO SOLICITE O NOME COMPLETO E REALIZE A INCLUSÃO.', 
true),

-- 12. SINEB 2.0
('EM CASOS DE SINEB 2.0', 
'A CAIXA está te oferecendo a proposta de renegociar o contrato para que você possa quitar seu(s) contrato(s) vencido(s).

"Lembramos que o pagamento efetuado permite a exclusão do seu CPF dos cadastros restritivos dentro de até 10 dias úteis."

- Alerto que as ligações terão continuidade e que os juros do(s) seu(s) contrato(s) são corrigidos diariamente.
- "A CAIXA não garante que as condições dessa proposta serão mantidas para um acordo futuro."
- "É importante regularizar a sua dívida para a exclusão do seu CPF dos cadastros restritivos."', 
true),

-- 13. Lei MT e RS
('LEI 12395/2024 (MATO GROSSO) E LEI 16276/2025 (RIO GRANDE DO SUL)', 
'A Lei 12395/2024 do Estado do Mato Grosso e a Lei 16276/2025 do Rio Grande Sul determinam que deve ser informado a composição dos valores cobrados quanto ao que efetivamente correspondem, destacando-se:

• Valor originário
• Juros
• Multas
• Taxas
• Custas
• Honorários
• Outros adicionais que, somados, correspondam ao valor total cobrado do consumidor

Esta informação deve ser fornecida ao cliente desses estados quando solicitado.', 
true)

ON CONFLICT (id) DO NOTHING;

-- Confirmar inserção
SELECT COUNT(*) as total_situacoes FROM situations;
