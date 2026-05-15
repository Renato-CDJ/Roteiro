"use client"

import { useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useCachedResultCodes } from "@/hooks/use-cached-data"
import { Search, Tags, Loader2, ZoomIn, ZoomOut, ShieldCheck, ShieldQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface OperatorResultCodesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Tabulações fixas — sempre exibidas independente do banco de dados
const STATIC_TABULATIONS = [
  // Antes da IP
  { id: "static-1", category: "before", color: "#f59e0b", name: "LIGAÇÃO CAIU", description: 'Atendimento interrompido sem que seja possível continuar o diálogo entre operador e cliente e sem possibilidade de realização da confirmação do CPF. Exemplo: "Alô" / "Quem é" / "De onde fala" / "Sou eu" / "Do que se trata" / etc.' },
  { id: "static-2", category: "before", color: "#f59e0b", name: "LIGAÇÃO MUDA", description: "Utilizar se a ligação se iniciou muda, fica sem fala do cliente. Lembrando que se a pessoa atender e houver ruídos ou vozes que não se direcionar a você será considerada uma Ligação muda." },
  { id: "static-3", category: "before", color: "#f59e0b", name: "RECADO COM TERCEIRO", description: "Terceiro atende e informa que a empresa entrou em falência ou terceiro informa que conhece o cliente, ou terceiro pede para ligar outro dia/horário ou em outro telefone." },
  { id: "static-4", category: "before", color: "#f59e0b", name: "FALECIDO", description: "Terceiro informa que o titular faleceu." },
  { id: "static-5", category: "before", color: "#f59e0b", name: "DESCONHECIDO NO TELEFONE", description: 'Terceiro informa que não conhece ninguém com o nome do cliente no telefone do cadastro. Exemplo: "Não conheço" / "Não é desse número" / "Não é daqui" / "Nunca ouvi falar" / etc.' },
  { id: "static-6", category: "before", color: "#f59e0b", name: "PESSOA NÃO CONFIRMA DADOS", description: 'Cliente se recusa confirmar os dados para prosseguir com atendimento. Utilize quando: O cliente informa CPF/CNPJ, mas os dados não conferem, o cliente se recusa a informar CPF/CNPJ, o cliente não lembra os dados ou quando o cliente diz que não pode falar no momento. Exemplo: "Não confirmo nada por telefone" / "Não, eu vou na agência" / "Não lembro meu CPF" / etc.' },
  { id: "static-7", category: "before", color: "#f59e0b", name: "FALÊNCIA OU CONCORDATA", description: "Utilizamos quando o sócio ou responsável financeiro informar que a empresa entrou em falência." },
  { id: "static-8", category: "before", color: "#f59e0b", name: "SINAL DE FAX", description: "Ligação direcionada: sinal de FAX." },
  { id: "static-9", category: "before", color: "#f59e0b", name: "CAIXA POSTAL", description: "Devemos utilizar quando a ligação é direcionada diretamente à caixa postal." },
  // Após a IP
  { id: "static-10", category: "after", color: "#22c55e", name: "CONTATO INTERROMPIDO APÓS IP, MAS SEM RESULTADO DEFINIDO", description: "A ligação foi interrompida sem conseguir um posicionamento da parte do cliente sobre a dívida. Situação: Ao questionar se foi pago, o cliente responde apenas com um NÃO e desliga." },
  { id: "static-11", category: "after", color: "#22c55e", name: "PESSOA SOLICITA RETORNO EM OUTRO MOMENTO", description: "Cliente pede para o operador retornar a ligação em outro dia/horário." },
  { id: "static-12", category: "after", color: "#22c55e", name: "PAGAMENTO JÁ EFETUADO", description: "Cliente informa que já efetuou o pagamento." },
  { id: "static-13", category: "after", color: "#22c55e", name: "PROMESSA DE PAGAMENTO SEM EMISSÃO DE BOLETO", description: "Cliente informa que irá pagar ou depositar dentro do prazo estabelecido [10 dias corridos]." },
  { id: "static-14", category: "after", color: "#22c55e", name: "CONTATO SEM NEGOCIAÇÃO", description: "Cliente informa que não consegue falar no momento e desliga, ou cliente informa que irá pagar ou depositar FORA do prazo estabelecido [10 dias corridos]." },
  { id: "static-15", category: "after", color: "#22c55e", name: "SEM CAPACIDADE DE PAGAMENTO", description: "Cliente informa que não possui capacidade de efetuar o pagamento. Exemplo: Informa que não tem recurso disponível, desemprego, mudanças econômicas ou não pode fazer o pagamento naquele momento." },
  { id: "static-16", category: "after", color: "#22c55e", name: "DÍVIDA NÃO RECONHECIDA", description: "Cliente alega que desconhece a dívida." },
  { id: "static-17", category: "after", color: "#22c55e", name: "NEGOCIAÇÃO EM OUTRO CANAL", description: "Cliente informa que já está negociando em outro canal." },
  { id: "static-18", category: "after", color: "#22c55e", name: "PROMESSA DE PAGAMENTO COM EMISSÃO DE BOLETO", description: "Cliente solicita boleto e informa data de pagamento dentro do período permitido [10 dias corridos]." },
  { id: "static-19", category: "after", color: "#22c55e", name: "ACEITA AÇÃO/CAMPANHA SEM EMISSÃO DE BOLETO", description: "Cliente aceita ação/campanha sem emissão de boleto." },
  { id: "static-20", category: "after", color: "#22c55e", name: "ACEITA AÇÃO/CAMPANHA COM EMISSÃO DE BOLETO", description: "Cliente aceita ação/campanha com emissão de boleto." },
  { id: "static-21", category: "after", color: "#22c55e", name: "CLIENTE COM ACORDO ATIVO RETORNA NO RECEPTIVO", description: "Quando o cliente retorna no receptivo tendo acordo vigente para solicitar esclarecimentos ou solicitar o boleto." },
  { id: "static-22", category: "after", color: "#22c55e", name: "PROMESSA DE PAGAMENTO ACORDO DE PARCELAMENTO", description: "Cliente confirma o pagamento parcelado do CARTÃO DE CRÉDITO." },
  { id: "static-23", category: "after", color: "#22c55e", name: "TRANSBORDO PARA ATENDIMENTO ENTRE CANAIS, COM IP", description: "Quando o atendimento é iniciado em um canal e precisa ser transbordado para resolução por outro canal após o cliente ter realizado a IP." },
  { id: "static-24", category: "after", color: "#22c55e", name: "TRANSBORDO PARA ATENDIMENTO ENTRE CANAIS, SEM IP", description: "Quando o atendimento é iniciado em um canal digital e precisa ser transbordado para resolução no atendimento humano antes do cliente ter realizado a IP." },
  { id: "static-25", category: "after", color: "#22c55e", name: "RECUSA AÇÃO/CAMPANHA", description: "Cliente não aceita a ação/campanha ofertada. Motivos possíveis: Sem capacidade de pagamento, Contato sem negociação/acordo, Negociação em outro canal, Pessoa solicita retorno em outro momento, Dívida não reconhecida, Promessa de pagamento sem emissão de boleto, Promessa de pagamento com emissão de boleto." },
]

export function OperatorResultCodesModal({ open, onOpenChange }: OperatorResultCodesModalProps) {
  const { resultCodes: resultCodesData, loading } = useCachedResultCodes()
  const [searchQuery, setSearchQuery] = useState("")
  const [globalZoom, setGlobalZoom] = useState(100)

  // Mescla tabulações fixas com as cadastradas no Supabase (sem duplicatas por nome)
  const tabulations = useMemo(() => {
    const dynamicNames = new Set(
      resultCodesData
        .filter((t: any) => t.is_active)
        .map((t: any) => t.name.trim().toUpperCase())
    )
    const dynamic = resultCodesData
      .filter((t: any) => t.is_active)
      .map((t: any) => ({
        id: t.id,
        name: t.name,
        description: t.description || "",
        color: t.color || "#3b82f6",
        category: t.category || "before",
        isActive: t.is_active,
      }))
    const statics = STATIC_TABULATIONS.filter(
      (s) => !dynamicNames.has(s.name.trim().toUpperCase())
    ).map((s) => ({ ...s, isActive: true }))
    return [...dynamic, ...statics]
  }, [resultCodesData])

  // Filter by search
  const filteredTabulations = useMemo(() => {
    if (!searchQuery) return tabulations
    const query = searchQuery.toLowerCase()
    return tabulations.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query)
    )
  }, [tabulations, searchQuery])

  // Separate by category
  const beforeTabulations = useMemo(() => {
    return filteredTabulations
      .filter((t) => t.category === "before")
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [filteredTabulations])

  const afterTabulations = useMemo(() => {
    return filteredTabulations
      .filter((t) => t.category === "after")
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [filteredTabulations])

  const renderTabulationCard = (tabulation: typeof tabulations[0]) => (
    <div
      key={tabulation.id}
      className="p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors group"
    >
      <div className="flex items-start gap-3">
        <div
          className="w-4 h-4 rounded-full flex-shrink-0 mt-1 ring-2 ring-offset-2 ring-offset-background"
          style={{ 
            backgroundColor: tabulation.color,
            ringColor: tabulation.color 
          }}
        />
        <div className="flex-1 min-w-0">
          <h4 
            className="font-semibold text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors"
            style={{ fontSize: `${globalZoom}%` }}
          >
            {tabulation.name}
          </h4>
          {tabulation.description && (
            <p 
              className="text-muted-foreground mt-1 leading-relaxed"
              style={{ fontSize: `${globalZoom * 0.875}%` }}
            >
              {tabulation.description}
            </p>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-5xl w-[95vw] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden [&>button]:z-50">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-white">
              <div className="p-2 bg-white/20 rounded-lg">
                <Tags className="h-6 w-6" />
              </div>
              Tabulacoes Disponiveis
            </DialogTitle>
            <DialogDescription className="text-orange-100 mt-2">
              Consulte as tabulacoes para classificar atendimentos - organizadas por momento de uso
            </DialogDescription>
          </DialogHeader>
          
          {/* Barra de busca e controles */}
          <div className="flex items-center gap-3 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-200" />
              <Input
                placeholder="Buscar tabulacao..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-orange-200 focus-visible:ring-white/30"
              />
            </div>
            <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setGlobalZoom(Math.max(80, globalZoom - 10))}
                className="h-8 w-8 text-white hover:bg-white/20"
                title="Diminuir texto"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium w-12 text-center">{globalZoom}%</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setGlobalZoom(Math.min(150, globalZoom + 10))}
                className="h-8 w-8 text-white hover:bg-white/20"
                title="Aumentar texto"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="px-6 py-3 bg-muted/50 border-b flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {filteredTabulations.length} {filteredTabulations.length === 1 ? "tabulacao encontrada" : "tabulacoes encontradas"}
            {beforeTabulations.length > 0 && afterTabulations.length > 0 && (
              <span className="ml-2">
                ({beforeTabulations.length} antes do CPF, {afterTabulations.length} depois do CPF)
              </span>
            )}
          </span>
          {searchQuery && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSearchQuery("")}
              className="text-xs h-7"
            >
              Limpar busca
            </Button>
          )}
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-orange-500 mb-4" />
                <p className="text-muted-foreground">Carregando tabulacoes...</p>
              </div>
            ) : filteredTabulations.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-3 opacity-50" />
                <p className="font-medium">Nenhum resultado encontrado</p>
                <p className="text-sm mt-1">Tente buscar por outro termo</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Coluna: Antes da confirmação de CPF */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-amber-500/30">
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                      <ShieldQuestion className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Antes da confirmacao de dados (CPF)</h3>
                      <p className="text-xs text-muted-foreground">
                        Use quando o cliente ainda nao confirmou os dados
                      </p>
                    </div>
                    <span className="ml-auto text-sm font-medium text-amber-600 bg-amber-500/10 px-2 py-1 rounded">
                      {beforeTabulations.length}
                    </span>
                  </div>
                  
                  {beforeTabulations.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg">
                      <p className="text-sm">Nenhuma tabulacao nesta categoria</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {beforeTabulations.map(renderTabulationCard)}
                    </div>
                  )}
                </div>

                {/* Coluna: Depois da confirmação de CPF */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-green-500/30">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <ShieldCheck className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Depois da confirmacao de dados (CPF)</h3>
                      <p className="text-xs text-muted-foreground">
                        Use quando o cliente ja confirmou os dados
                      </p>
                    </div>
                    <span className="ml-auto text-sm font-medium text-green-600 bg-green-500/10 px-2 py-1 rounded">
                      {afterTabulations.length}
                    </span>
                  </div>
                  
                  {afterTabulations.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg">
                      <p className="text-sm">Nenhuma tabulacao nesta categoria</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {afterTabulations.map(renderTabulationCard)}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
