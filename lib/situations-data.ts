/**
 * Dados de Situações pré-cadastradas
 * Estas situações são orientações para os operadores sobre como proceder em casos específicos
 */

export interface Situation {
  id: string
  title: string
  description: string
  correctTabulation?: string
  examples?: string[]
}

export const SITUATIONS_DATA: Situation[] = [
  {
    id: "sit-001",
    title: "EM CASOS DE FALÊNCIA/CONCORDATA",
    description:
      "É necessário que o sócio ou responsável entre em contato com a CAIXA acessando www.caixa.gov.br/negociar e pelo WhatsApp 0800 101 0104.",
    correctTabulation: "Recado com terceiro",
  },
  {
    id: "sit-002",
    title: "FALECIDO",
    description:
      "Pessoa informa que o titular faleceu. É necessário que compareça à agência levando a certidão de óbito para que as ligações de cobrança sejam interrompidas.",
    correctTabulation: "FALECIDO",
  },
  {
    id: "sit-003",
    title: "SE O CLIENTE CITAR A LGPD OU PERGUNTAR POR QUE TEMOS OS SEUS DADOS",
    description:
      '"(NOME DO CLIENTE), seguindo a lei LGPD, n°13.709, possuímos alguns dados representando a CAIXA ECONÔMICA FEDERAL, para garantir sua segurança. Caso você possua qualquer dúvida ou solicitação em relação a isso, pedimos que entre em contato conosco enviando um e-mail para: dpo@gruporoveri.com.br."',
    examples: [
      "Como você possui meus dados pessoais?",
      "Vocês têm o direito de me ligar?",
      "Isso está conforme a LGPD?",
      "Quero que excluam meus dados!",
    ],
  },
  {
    id: "sit-004",
    title: "O CLIENTE SOLICITA O PROTOCOLO DA LIGAÇÃO",
    description:
      "Informar que nós somos uma central de negócios, ou seja, nosso atendimento não possui caráter de SAC. Entretanto, como mencionamos no início do contato, todas as ligações são gravadas e para que você tenha acesso a elas é necessário que as solicite na sua agência de relacionamento.",
    examples: ["PORQUE NÃO PODEMOS REPASSAR ESSA INFORMAÇÃO PARA O CLIENTE? Nossa assessoria não é SAC."],
  },
  {
    id: "sit-005",
    title: 'SE O CLIENTE INFORMAR QUE "NÃO RESIDE NO IMÓVEL"',
    description:
      "Embora o senhor(a) não resida no local, a dívida está registrada em seu nome e CPF, o que o(a) mantém como responsável pela regularização. Para resolver essa situação de forma rápida e eficiente, sugerimos que entre em contato com a pessoa que realiza o pagamento dessa dívida. Isso pode ajudar a esclarecer se o pagamento já foi efetuado, se há uma data prevista para a quitação ou outras informações relevantes.",
  },
  {
    id: "sit-006",
    title: "CLIENTE SOLICITOU A LIGAÇÃO DO ATENDIMENTO",
    description: `CASO O CONTRATO SEJA DOS ESTADOS:
PARANÁ - DDD (41, 42, 43, 44, 45 e 46)
RIO DE JANEIRO - DDD (21)
SÃO PAULO - DDD (11)
MATO GROSSO - DDD (65)

Devemos informar: "A solicitação será repassada à CAIXA para verificação e atendimento no prazo de até 7 (sete) dias úteis."

PARA OUTROS ESTADOS:
Nesses casos, o que deve ser repassado para o cliente é: "Você pode solicitar a escuta da ligação na sua agência de relacionamento."`,
  },
  {
    id: "sit-007",
    title: "QUANDO O CLIENTE DO FIES DISSER QUE QUER PAUSAR O PAGAMENTO DAS SUAS PARCELAS",
    description: `Caso o cliente do FIES questione a possibilidade de renegociar ou solicite o desconto para seu contrato, informar:

"Você pode verificar se o seu contrato tem a possibilidade de realizar renegociação no site http://sifesweb.caixa.gov.br, APP FIES CAIXA ou na sua agência."

ATENÇÃO! Lembrando que essa orientação só deve ser repassada para aqueles clientes que já fizeram a confirmação positiva.`,
  },
  {
    id: "sit-008",
    title: "CONTRATOS DE EMPRÉSTIMO CONSIGNADO",
    description: `Devemos orientar o cliente pedindo para que ele verifique novamente se o valor foi de fato descontado da folha de pagamento. Caso ele fale que vai aguardar em linha este retorno. Se o cliente disser que não pode fazer essa verificação durante o atendimento, podemos solicitar o melhor horário e telefone para realizar um contato futuro.

QUESTIONAMENTO NORMALMENTE REALIZADO PELO CLIENTE:
"Isso é descontado na minha folha de pagamento, não está aparecendo no sistema?"`,
  },
  {
    id: "sit-009",
    title: "NÃO RECONHECE A DÍVIDA",
    description:
      "Orientar o cliente a procurar uma agência da CAIXA para mais informações ou ligar no 0800 101 0104. Para cartão de crédito, indicar a central de atendimento que está no verso do cartão para contestação das despesas.",
    correctTabulation: "DÍVIDA NÃO RECONHECIDA",
  },
  {
    id: "sit-010",
    title: "O QUE FAZER QUANDO CAIR UM PRODUTO QUE NÃO ATENDO?",
    description: `PASSO A PASSO:
1. ABORDAGEM PADRÃO;
2. CONFIRMAÇÃO DE DADOS - IDENTIFICAÇÃO POSITIVA;
3. INFORMAR AO CLIENTE: "PEÇO QUE AGUARDE UM INSTANTE QUE IREI TRANSFERIR AO SETOR RESPONSÁVEL";
4. TRANSFERIR NA SEGUNDA ABA DO WEDOO EM "CAMPANHA RECEPTIVO";
5. TABULAR: TRANSFERÊNCIA DE LIGAÇÃO.`,
    correctTabulation: "TRANSFERÊNCIA DE LIGAÇÃO",
  },
  {
    id: "sit-011",
    title: "O QUE FAZER QUANDO CAIR ATENDIMENTO CNPJ?",
    description: `ABORDAGEM PADRÃO: FALAR NOME DO SÓCIO QUE CONSTA EM DADOS DO CLIENTE;

• SE CONSTAR NOME DA EMPRESA EM DADOS DO CLIENTE, SOLICITE PARA FALAR COM SÓCIO OU RESPONSÁVEL FINANCEIRO DA EMPRESA;
• VERIFIQUE O NOME DO SÓCIO OU RESPONSÁVEL FINANCEIRO DA EMPRESA EM: DETALHES DO CLIENTE;
• SE NÃO CONSTAR ESSA INFORMAÇÃO SOLICITE O NOME COMPLETO E REALIZE A INCLUSÃO.`,
  },
  {
    id: "sit-012",
    title: "EM CASOS DE SINEB 2.0",
    description: `A CAIXA está te oferecendo a proposta de renegociar o contrato para que você possa quitar seu(s) contrato(s) vencido(s).

"Lembramos que o pagamento efetuado permite a exclusão do seu CPF dos cadastros restritivos dentro de até 10 dias úteis."

• Alerto que as ligações terão continuidade e que os juros do(s) seu(s) contrato(s) são corrigidos diariamente.
• "A CAIXA não garante que as condições dessa proposta serão mantidas para um acordo futuro."
• "É importante regularizar a sua dívida para a exclusão do seu CPF dos cadastros restritivos."`,
  },
  {
    id: "sit-013",
    title: "A Lei 12395/2024 do Estado do Mato Grosso e a Lei 16276/2025 do Rio Grande Sul",
    description:
      "A Lei 12395/2024 do Estado do Mato Grosso e a Lei 16276/2025 do Rio Grande Sul também determinam que deve ser informado a composição dos valores cobrados quanto a o que efetivamente correspondem, destacando-se o valor originário e seus adicionais (juros, multas, taxas, custas, honorários e outros que, somados, correspondam ao valor total cobrado do consumidor) ao cliente desse estado que solicitar.",
  },
  {
    id: "sit-014",
    title: "DESENROLA BRASIL - DÚVIDAS",
    description: `1. O que é o NOVO DESENROLA BRASIL?
É um programa do Governo Federal que permite a renegociação de dívidas com descontos e juros menores, possibilitando a troca por uma dívida mais barata, com foco em reduzir o endividamento das famílias.

2. Quem pode participar do programa?
Pessoas físicas com renda mensal de até cinco salários mínimos, atualmente equivalente a R$ 8.105,00, com dívidas em atraso entre 91 e 720 dias, apuradas no dia anterior à publicação da Medida Provisória 1355/2026 (03/05/2026), em operações contratadas até 31/01/2026.

3. Quais dívidas podem ser renegociadas?
Dívidas contratadas até 31 de janeiro de 2026, com atraso entre 90 dias (mais de 90 dias) e 720 dias (até 2 anos), nas modalidades: cartão de crédito (rotativo), cheque especial e crédito pessoal não consignado (incluindo CDC).
Dívidas de consignado, habitacional, veículo com alienação e crédito rural não compõem o escopo do Desenrola Famílias.

4. Quais as modalidades do Programa?
• Desenrola Famílias (ESTAMOS NESSA FASE) — pessoas físicas com renda de até 5 salários mínimos.
• Desenrola Fies — estudantes com débitos no Fundo de Financiamento Estudantil.
• Desenrola Empresas — micro e pequenas empresas, com mudanças em Pronampe e Procred.
• Desenrola Rural — agricultores familiares, com prazo ampliado até 20/12/2026.

5. Quais são as condições oferecidas?
Descontos de 30% a 90% sobre o valor principal da dívida.
Opção de pagamento à vista ou parcelado (a iniciar), conforme análise do contrato.

6. Posso usar o FGTS para pagar a dívida?
Sim. É permitido utilizar até 20% do saldo disponível do FGTS ou até R$ 1.000,00, prevalecendo o maior valor, para quitação ou amortização das dívidas. O calendário para utilização será divulgado futuramente pela Caixa.

7. Há alguma restrição para quem aderir ao programa?
Sim. Quem renegociar a dívida dentro do programa ficará impedido de fazer apostas em jogos online por um ano, conforme regra estabelecida pelo governo.
Caso a liquidação da dívida seja com perda de capital, o cliente ficará impedido de contratar com a CAIXA pelo período de 5 anos (comercial) e 3 anos (cartão de crédito).

8. Como será o impedimento ao uso de apostas online?
O bloqueio não é feito pela CAIXA nem pela empresa terceirizada. É uma regra do próprio NOVO DESENROLA BRASIL, definida pelo Governo Federal.

9. O nome do cliente sai do Serasa e do SPC?
Sim. Após a contratação do crédito novo dentro do Desenrola e o cumprimento da renegociação (pagamento da primeira parcela ou conforme protocolo), a instituição comunica os birôs de crédito para a baixa da negativação. O prazo regulamentar para exclusão é de até 5 dias úteis após a confirmação.

10. Onde posso tirar mais dúvidas ou confirmar informações?
Para dúvidas adicionais sobre o NOVO DESENROLA BRASIL, o cliente pode entrar em contato pelo WhatsApp Caixa 0800 104 0104 ou Alô CAIXA – 4004 0104 (Capitais e Regiões Metropolitanas) e 0800 104 0104 (Demais Regiões).

11. Cliente deseja fazer o acordo parcelado?
No WhatsApp CAIXA 0800 104 0104 é possível registrar interesse para contato futuro, caso a CAIXA venha a disponibilizar novas opções de negociação, como o parcelamento de contratos.`,
  },
]

/**
 * Busca uma situação pelo ID
 */
export function getSituationById(id: string): Situation | undefined {
  return SITUATIONS_DATA.find((situation) => situation.id === id)
}

/**
 * Busca situações pelo título (busca parcial, case-insensitive)
 */
export function searchSituationsByTitle(searchTerm: string): Situation[] {
  const term = searchTerm.toLowerCase()
  return SITUATIONS_DATA.filter((situation) => situation.title.toLowerCase().includes(term))
}

/**
 * Busca situações que possuem tabulação correta definida
 */
export function getSituationsWithTabulation(): Situation[] {
  return SITUATIONS_DATA.filter((situation) => situation.correctTabulation)
}

/**
 * Retorna todas as situações
 */
export function getAllSituations(): Situation[] {
  return SITUATIONS_DATA
}
