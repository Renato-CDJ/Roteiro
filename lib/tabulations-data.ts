// Tabulações pré-cadastradas para o sistema de call center
// Organizadas em duas fases: Antes e Após a confirmação do CPF (Identificação Positiva)

export interface TabulationData {
  id: string
  name: string
  description: string
  examples?: string[]
  phase: "before" | "after" // before = Antes da IP, after = Após a IP
}

// Tabulações ANTES de confirmar os dados (CPF) - Antes da Identificação Positiva
export const tabulationsBeforeIP: TabulationData[] = [
  {
    id: "ligacao-caiu",
    name: "LIGAÇÃO CAIU",
    description: "Atendimento interrompido sem que seja possível continuar o diálogo entre operador e cliente e sem possibilidade de realização da confirmação do CPF.",
    examples: ["Alô", "Quem é", "De onde fala", "Sou eu", "Do que se trata"],
    phase: "before"
  },
  {
    id: "ligacao-muda",
    name: "LIGAÇÃO MUDA",
    description: "Utilizar se a ligação se iniciou muda, fica sem fala do cliente. Lembrando que se a pessoa atender e houver ruídos ou vozes que não se direcionar a você será considerada uma Ligação muda.",
    phase: "before"
  },
  {
    id: "recado-com-terceiro",
    name: "RECADO COM TERCEIRO",
    description: "Terceiro atende e informa que a empresa entrou em falência ou terceiro informa que conhece o cliente, ou terceiro pede para ligar outro dia/horário ou em outro telefone.",
    phase: "before"
  },
  {
    id: "falecido",
    name: "FALECIDO",
    description: "Terceiro informa que o titular faleceu.",
    phase: "before"
  },
  {
    id: "desconhecido-no-telefone",
    name: "DESCONHECIDO NO TELEFONE",
    description: "Terceiro informa que não conhece ninguém com o nome do cliente no telefone do cadastro.",
    examples: ["Não conheço", "Não é desse número", "Não é daqui", "Nunca ouvi falar"],
    phase: "before"
  },
  {
    id: "pessoa-nao-confirma-dados",
    name: "PESSOA NÃO CONFIRMA DADOS",
    description: "Cliente se recusa confirmar os dados para prosseguir com atendimento. Utilize quando: O cliente informa CPF/CNPJ, mas os dados não conferem, o cliente se recusa a informar CPF/CNPJ, o cliente não lembra os dados ou quando o cliente diz que não pode falar no momento.",
    examples: ["Não confirmo nada por telefone", "Não, eu vou na agência", "Não lembro meu CPF"],
    phase: "before"
  },
  {
    id: "falencia-ou-concordata",
    name: "FALÊNCIA OU CONCORDATA",
    description: "Utilizamos quando o sócio ou responsável financeiro informar que a empresa entrou em falência.",
    phase: "before"
  },
  {
    id: "desconhecido",
    name: "DESCONHECIDO",
    description: "Terceiro informa que não conhece ninguém com o nome do cliente no telefone do cadastro.",
    examples: ["Não conheço", "Não é desse número", "Não é daqui", "Nunca ouvi falar"],
    phase: "before"
  },
  {
    id: "sinal-de-fax",
    name: "SINAL DE FAX",
    description: "Ligação direcionada: sinal de FAX.",
    phase: "before"
  },
  {
    id: "caixa-postal",
    name: "CAIXA POSTAL",
    description: "Devemos utilizar quando a ligação é direcionada diretamente à caixa postal.",
    phase: "before"
  }
]

// Tabulações APÓS confirmar os dados (CPF) - Após a Identificação Positiva
export const tabulationsAfterIP: TabulationData[] = [
  {
    id: "contato-interrompido-apos-ip",
    name: "CONTATO INTERROMPIDO APÓS IP, MAS SEM RESULTADO DEFINIDO",
    description: "A ligação foi interrompida sem conseguir um posicionamento da parte do cliente sobre a dívida.",
    examples: ["Ao questionar se foi pago, o cliente responde apenas com um NÃO e desliga."],
    phase: "after"
  },
  {
    id: "pessoa-solicita-retorno",
    name: "PESSOA SOLICITA RETORNO EM OUTRO MOMENTO",
    description: "Cliente pede para o operador retornar a ligação em outro dia/horário.",
    phase: "after"
  },
  {
    id: "pagamento-ja-efetuado",
    name: "PAGAMENTO JÁ EFETUADO",
    description: "Cliente informa que já efetuou o pagamento.",
    phase: "after"
  },
  {
    id: "promessa-pagamento-sem-boleto",
    name: "PROMESSA DE PAGAMENTO SEM EMISSÃO DE BOLETO",
    description: "Cliente informa que irá pagar ou depositar dentro do prazo estabelecido [10 dias corridos].",
    phase: "after"
  },
  {
    id: "contato-sem-negociacao",
    name: "CONTATO SEM NEGOCIAÇÃO",
    description: "Cliente informa que não consegue falar no momento e desliga, ou cliente informa que irá pagar ou depositar FORA do prazo estabelecido [10 dias corridos].",
    phase: "after"
  },
  {
    id: "sem-capacidade-pagamento",
    name: "SEM CAPACIDADE DE PAGAMENTO",
    description: "Cliente informa que não possui capacidade de efetuar o pagamento.",
    examples: ["Informa que não tem recurso disponível", "desemprego", "mudanças econômicas", "não pode fazer o pagamento naquele momento"],
    phase: "after"
  },
  {
    id: "divida-nao-reconhecida",
    name: "DÍVIDA NÃO RECONHECIDA",
    description: "Cliente alega que desconhece a dívida.",
    phase: "after"
  },
  {
    id: "negociacao-outro-canal",
    name: "NEGOCIAÇÃO EM OUTRO CANAL",
    description: "Cliente informa que já está negociando em outro canal.",
    phase: "after"
  },
  {
    id: "promessa-pagamento-com-boleto",
    name: "PROMESSA DE PAGAMENTO COM EMISSÃO DE BOLETO",
    description: "Cliente solicita boleto e informa data de pagamento dentro do período permitido [10 dias corridos].",
    phase: "after"
  },
  {
    id: "aceita-acao-sem-boleto",
    name: "ACEITA AÇÃO/CAMPANHA SEM EMISSÃO DE BOLETO",
    description: "Cliente aceita ação/campanha sem emissão de boleto.",
    phase: "after"
  },
  {
    id: "aceita-acao-com-boleto",
    name: "ACEITA AÇÃO/CAMPANHA COM EMISSÃO DE BOLETO",
    description: "Cliente aceita ação/campanha com emissão de boleto.",
    phase: "after"
  },
  {
    id: "cliente-acordo-ativo-receptivo",
    name: "CLIENTE COM ACORDO ATIVO RETORNA NO RECEPTIVO",
    description: "Quando o cliente retorna no receptivo tendo acordo vigente para solicitar esclarecimentos ou solicitar o boleto.",
    phase: "after"
  },
  {
    id: "promessa-pagamento-parcelamento",
    name: "PROMESSA DE PAGAMENTO ACORDO DE PARCELAMENTO",
    description: "Cliente confirma o pagamento parcelado do CARTÃO DE CRÉDITO.",
    phase: "after"
  },
  {
    id: "transbordo-com-ip",
    name: "TRANSBORDO PARA ATENDIMENTO ENTRE CANAIS, COM IP",
    description: "Quando o atendimento é iniciado em um canal e precisa ser transbordado para resolução por outro canal após o cliente ter realizado a IP.",
    phase: "after"
  },
  {
    id: "transbordo-sem-ip",
    name: "TRANSBORDO PARA ATENDIMENTO ENTRE CANAIS, SEM IP",
    description: "Quando o atendimento é iniciado em um canal digital e precisa ser transbordado para resolução no atendimento humano antes do cliente ter realizado a IP.",
    phase: "after"
  },
  {
    id: "recusa-acao-campanha",
    name: "RECUSA AÇÃO/CAMPANHA + MOTIVO DA RECUSA",
    description: "Cliente recusa ação/campanha. Motivos possíveis: Sem capacidade de pagamento, Contato sem negociação/acordo, Negociação em outro canal, Pessoa solicita retorno em outro momento, Dívida não reconhecida, Promessa de pagamento sem emissão de boleto, Promessa de pagamento com emissão de boleto.",
    phase: "after"
  }
]

// Todas as tabulações combinadas
export const allTabulations: TabulationData[] = [
  ...tabulationsBeforeIP,
  ...tabulationsAfterIP
]

// Função auxiliar para buscar tabulação por ID
export function getTabulationById(id: string): TabulationData | undefined {
  return allTabulations.find(tab => tab.id === id)
}

// Função auxiliar para buscar tabulações por fase
export function getTabulationsByPhase(phase: "before" | "after"): TabulationData[] {
  return phase === "before" ? tabulationsBeforeIP : tabulationsAfterIP
}

// Função auxiliar para buscar tabulação por nome
export function getTabulationByName(name: string): TabulationData | undefined {
  return allTabulations.find(tab => tab.name.toLowerCase() === name.toLowerCase())
}
