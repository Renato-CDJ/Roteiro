"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useResultCodes } from "@/hooks/use-supabase-admin"
import {
  ListChecks,
  Plus,
  Trash2,
  Edit,
  Search,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// ---------------------------------------------------------------------------
// Tabulações fixas — registradas diretamente no código para não precisar
// ser recadastradas a cada deploy.
// ---------------------------------------------------------------------------

interface StaticTabulation {
  name: string
  description: string
  phase: "before" | "after"
}

const STATIC_TABULATIONS: StaticTabulation[] = [
  // ── Antes da IP ──────────────────────────────────────────────────────────
  {
    phase: "before",
    name: "LIGAÇÃO CAIU",
    description:
      "Atendimento interrompido sem que seja possível continuar o diálogo entre operador e cliente e sem possibilidade de realização da confirmação do CPF. Exemplo de resposta por parte do cliente/terceiro: "Alô" / "Quem é" / "De onde fala" / "Sou eu" / "Do que se trata" / etc.",
  },
  {
    phase: "before",
    name: "LIGAÇÃO MUDA",
    description:
      "Utilizar se a ligação se iniciou muda, fica sem fala do cliente. Lembrando que se a pessoa atender e houver ruídos ou vozes que não se direcionar a você será considerada uma Ligação muda.",
  },
  {
    phase: "before",
    name: "RECADO COM TERCEIRO",
    description:
      "Terceiro atende e informa que a empresa entrou em falência ou terceiro informa que conhece o cliente, ou terceiro pede para ligar outro dia/horário ou em outro telefone.",
  },
  {
    phase: "before",
    name: "FALECIDO",
    description: "Terceiro informa que o titular faleceu.",
  },
  {
    phase: "before",
    name: "DESCONHECIDO NO TELEFONE",
    description:
      "Terceiro informa que não conhece ninguém com o nome do cliente no telefone do cadastro. Exemplo de resposta por parte do cliente/terceiro: "Não conheço" / "Não é desse número" / "Não é daqui" / "Nunca ouvi falar" / etc.",
  },
  {
    phase: "before",
    name: "PESSOA NÃO CONFIRMA DADOS",
    description:
      "Cliente se recusa confirmar os dados para prosseguir com atendimento. Utilize quando: O cliente informa CPF/CNPJ, mas os dados não conferem, o cliente se recusa a informar CPF/CNPJ, o cliente não lembra os dados ou quando o cliente diz que não pode falar no momento. Exemplo de resposta por parte do cliente: "Não confirmo nada por telefone" / "Não, eu vou na agência" / "Não lembro meu CPF" / etc.",
  },
  {
    phase: "before",
    name: "FALÊNCIA OU CONCORDATA",
    description:
      "Utilizamos quando o sócio ou responsável financeiro informar que a empresa entrou em falência.",
  },
  {
    phase: "before",
    name: "SINAL DE FAX",
    description: "Ligação direcionada: sinal de FAX.",
  },
  {
    phase: "before",
    name: "CAIXA POSTAL",
    description: "Devemos utilizar quando a ligação é direcionada diretamente à caixa postal.",
  },

  // ── Após a IP ────────────────────────────────────────────────────────────
  {
    phase: "after",
    name: "CONTATO INTERROMPIDO APÓS IP, MAS SEM RESULTADO DEFINIDO",
    description:
      "A ligação foi interrompida sem conseguir um posicionamento da parte do cliente sobre a dívida. Situação: Ao questionar se foi pago, o cliente responde apenas com um NÃO e desliga.",
  },
  {
    phase: "after",
    name: "PESSOA SOLICITA RETORNO EM OUTRO MOMENTO",
    description: "Cliente pede para o operador retornar a ligação em outro dia/horário.",
  },
  {
    phase: "after",
    name: "PAGAMENTO JÁ EFETUADO",
    description: "Cliente informa que já efetuou o pagamento.",
  },
  {
    phase: "after",
    name: "PROMESSA DE PAGAMENTO SEM EMISSÃO DE BOLETO",
    description:
      "Cliente informa que irá pagar ou depositar dentro do prazo estabelecido [10 dias corridos].",
  },
  {
    phase: "after",
    name: "CONTATO SEM NEGOCIAÇÃO",
    description:
      "Cliente informa que não consegue falar no momento e desliga, ou cliente informa que irá pagar ou depositar FORA do prazo estabelecido [10 dias corridos].",
  },
  {
    phase: "after",
    name: "SEM CAPACIDADE DE PAGAMENTO",
    description:
      "Cliente informa que não possui capacidade de efetuar o pagamento. Exemplo dos motivos: Informa que não tem recurso disponível, desemprego, mudanças econômicas ou não pode fazer o pagamento naquele momento.",
  },
  {
    phase: "after",
    name: "DÍVIDA NÃO RECONHECIDA",
    description: "Cliente alega que desconhece a dívida.",
  },
  {
    phase: "after",
    name: "NEGOCIAÇÃO EM OUTRO CANAL",
    description: "Cliente informa que já está negociando em outro canal.",
  },
  {
    phase: "after",
    name: "PROMESSA DE PAGAMENTO COM EMISSÃO DE BOLETO",
    description:
      "Cliente solicita boleto e informa data de pagamento dentro do período permitido [10 dias corridos].",
  },
  {
    phase: "after",
    name: "ACEITA AÇÃO/CAMPANHA SEM EMISSÃO DE BOLETO",
    description: "Cliente aceita ação/campanha sem emissão de boleto.",
  },
  {
    phase: "after",
    name: "ACEITA AÇÃO/CAMPANHA COM EMISSÃO DE BOLETO",
    description: "Cliente aceita ação/campanha com emissão de boleto.",
  },
  {
    phase: "after",
    name: "CLIENTE COM ACORDO ATIVO RETORNA NO RECEPTIVO",
    description:
      "Quando o cliente retorna no receptivo tendo acordo vigente para solicitar esclarecimentos ou solicitar o boleto.",
  },
  {
    phase: "after",
    name: "PROMESSA DE PAGAMENTO ACORDO DE PARCELAMENTO",
    description: "Cliente confirma o pagamento parcelado do CARTÃO DE CRÉDITO.",
  },
  {
    phase: "after",
    name: "TRANSBORDO PARA ATENDIMENTO ENTRE CANAIS, COM IP",
    description:
      "Quando o atendimento é iniciado em um canal e precisa ser transbordado para resolução por outro canal após o cliente ter realizado a IP.",
  },
  {
    phase: "after",
    name: "TRANSBORDO PARA ATENDIMENTO ENTRE CANAIS, SEM IP",
    description:
      "Quando o atendimento é iniciado em um canal digital e precisa ser transbordado para resolução no atendimento humano antes do cliente ter realizado a IP.",
  },
  {
    phase: "after",
    name: "RECUSA AÇÃO/CAMPANHA",
    description:
      "Cliente não aceita a ação/campanha ofertada. Motivos possíveis: Sem capacidade de pagamento, Contato sem negociação/acordo, Negociação em outro canal, Pessoa solicita retorno em outro momento, Dívida não reconhecida, Promessa de pagamento sem emissão de boleto, Promessa de pagamento com emissão de boleto.",
  },
]

// ---------------------------------------------------------------------------

interface ResultCode {
  id: string
  code: string
  name: string
  description: string
  category: string
  color: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export function ResultCodesTab() {
  const { data: resultCodes, loading, create, update, remove } = useResultCodes()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPhase, setFilterPhase] = useState<"all" | "before" | "after">("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingCode, setEditingCode] = useState<ResultCode | null>(null)
  const [formCode, setFormCode] = useState("")
  const [formName, setFormName] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formPhase, setFormPhase] = useState<"before" | "after">("before")
  const [saving, setSaving] = useState(false)
  const [showReference, setShowReference] = useState(true)
  const [referenceFilter, setReferenceFilter] = useState<"all" | "before" | "after">("all")
  const { toast } = useToast()

  const filteredCodes = useMemo(() => {
    return resultCodes
      .filter((c) => {
        if (filterPhase !== "all" && c.category !== filterPhase) return false
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          return (
            c.name.toLowerCase().includes(query) ||
            c.code?.toLowerCase().includes(query) ||
            c.description?.toLowerCase().includes(query)
          )
        }
        return true
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }, [resultCodes, searchQuery, filterPhase])

  const filteredStaticTabs = useMemo(() => {
    if (referenceFilter === "all") return STATIC_TABULATIONS
    return STATIC_TABULATIONS.filter((t) => t.phase === referenceFilter)
  }, [referenceFilter])

  const beforeCount = resultCodes.filter((c) => c.category === "before").length
  const afterCount = resultCodes.filter((c) => c.category === "after").length

  const resetForm = () => {
    setFormCode("")
    setFormName("")
    setFormDescription("")
    setFormPhase("before")
    setEditingCode(null)
  }

  const handleCreate = async () => {
    if (!formName.trim()) {
      toast({ title: "Erro", description: "O nome é obrigatório.", variant: "destructive" })
      return
    }

    setSaving(true)
    const { error } = await create({
      code: formCode.trim() || `TAB-${Date.now()}`,
      name: formName.trim(),
      description: formDescription.trim(),
      category: formPhase,
      color: formPhase === "before" ? "#f59e0b" : "#22c55e",
      is_active: true,
    })

    if (error) {
      toast({ title: "Erro", description: error, variant: "destructive" })
    } else {
      toast({ title: "Sucesso", description: "Tabulação criada com sucesso." })
      resetForm()
      setShowCreateDialog(false)
    }
    setSaving(false)
  }

  const handleUpdate = async () => {
    if (!editingCode) return
    if (!formName.trim()) {
      toast({ title: "Erro", description: "O nome é obrigatório.", variant: "destructive" })
      return
    }

    setSaving(true)
    const { error } = await update(editingCode.id, {
      code: formCode.trim(),
      name: formName.trim(),
      description: formDescription.trim(),
      category: formPhase,
      color: formPhase === "before" ? "#f59e0b" : "#22c55e",
    })

    if (error) {
      toast({ title: "Erro", description: error, variant: "destructive" })
    } else {
      toast({ title: "Sucesso", description: "Tabulação atualizada." })
      resetForm()
      setEditingCode(null)
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta tabulação?")) return

    const { error } = await remove(id)
    if (error) {
      toast({ title: "Erro", description: error, variant: "destructive" })
    } else {
      toast({ title: "Sucesso", description: "Tabulação excluída." })
    }
  }

  const handleToggleActive = async (code: ResultCode) => {
    await update(code.id, { is_active: !code.is_active })
  }

  const startEdit = (code: ResultCode) => {
    setEditingCode(code)
    setFormCode(code.code || "")
    setFormName(code.name)
    setFormDescription(code.description || "")
    setFormPhase(code.category === "after" ? "after" : "before")
  }

  const cancelEdit = () => {
    resetForm()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  const formFields = (isEdit: boolean) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Nome da Tabulação</Label>
        <Input
          placeholder="Ex: Sem Interesse"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          autoFocus
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">Descrição</Label>
        <Textarea
          placeholder="Descrição da tabulação..."
          value={formDescription}
          onChange={(e) => setFormDescription(e.target.value)}
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">Fase</Label>
        <Select value={formPhase} onValueChange={(v: "before" | "after") => setFormPhase(v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="before">
              <span className="flex items-center gap-2">
                <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
                Antes de confirmar os dados (CPF)
              </span>
            </SelectItem>
            <SelectItem value="after">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
                Após confirmar os dados (CPF)
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        {isEdit ? (
          <>
            <Button variant="outline" onClick={cancelEdit}>
              Cancelar
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={saving}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Salvar Alterações
            </Button>
          </>
        ) : (
          <Button
            onClick={handleCreate}
            disabled={saving}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Criar Tabulação
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ListChecks className="h-6 w-6 text-orange-500" />
            Códigos de Resultado
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Tabulações separadas para usar antes e depois da confirmação dos dados
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => {
                resetForm()
                setShowCreateDialog(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Tabulação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Tabulação</DialogTitle>
              <DialogDescription>
                Adicione uma nova tabulação para códigos de resultado
              </DialogDescription>
            </DialogHeader>
            {formFields(false)}
          </DialogContent>
        </Dialog>
      </div>

      {/* ── Referência Fixa ─────────────────────────────────────────────────── */}
      <Card className="border-blue-500/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-500" />
              <CardTitle className="text-base">Tabela de Referência de Tabulações</CardTitle>
              <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 border-blue-500/30">
                {STATIC_TABULATIONS.length} tabulações
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={referenceFilter}
                onValueChange={(v: "all" | "before" | "after") => setReferenceFilter(v)}
              >
                <SelectTrigger className="w-[220px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as fases</SelectItem>
                  <SelectItem value="before">Antes da IP</SelectItem>
                  <SelectItem value="after">Após a IP</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReference((v) => !v)}
                className="h-8 px-2"
              >
                {showReference ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <CardDescription>
            Lista oficial de tabulações registradas no sistema — não requer recadastro a cada deploy.
          </CardDescription>
        </CardHeader>

        {showReference && (
          <CardContent className="pt-0">
            {/* Before IP */}
            {(referenceFilter === "all" || referenceFilter === "before") && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldAlert className="h-4 w-4 text-amber-500" />
                  <h3 className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                    Tabulações antes da IP
                  </h3>
                  <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600 border-amber-500/30">
                    {STATIC_TABULATIONS.filter((t) => t.phase === "before").length}
                  </Badge>
                </div>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-amber-500/5">
                      <TableRow>
                        <TableHead className="text-xs font-semibold w-[220px]">Tabulação</TableHead>
                        <TableHead className="text-xs font-semibold">Descrição</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStaticTabs
                        .filter((t) => t.phase === "before")
                        .map((tab) => (
                          <TableRow key={tab.name} className="hover:bg-muted/20">
                            <TableCell className="py-3 align-top">
                              <span className="text-sm font-medium text-foreground leading-snug">
                                {tab.name}
                              </span>
                            </TableCell>
                            <TableCell className="py-3 align-top">
                              <span className="text-sm text-muted-foreground leading-relaxed">
                                {tab.description}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* After IP */}
            {(referenceFilter === "all" || referenceFilter === "after") && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="h-4 w-4 text-green-500" />
                  <h3 className="text-sm font-semibold text-green-600 dark:text-green-400">
                    Tabulações após a IP
                  </h3>
                  <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500/30">
                    {STATIC_TABULATIONS.filter((t) => t.phase === "after").length}
                  </Badge>
                </div>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-green-500/5">
                      <TableRow>
                        <TableHead className="text-xs font-semibold w-[220px]">Tabulação</TableHead>
                        <TableHead className="text-xs font-semibold">Descrição</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStaticTabs
                        .filter((t) => t.phase === "after")
                        .map((tab) => (
                          <TableRow key={tab.name} className="hover:bg-muted/20">
                            <TableCell className="py-3 align-top">
                              <span className="text-sm font-medium text-foreground leading-snug">
                                {tab.name}
                              </span>
                            </TableCell>
                            <TableCell className="py-3 align-top">
                              <span className="text-sm text-muted-foreground leading-relaxed">
                                {tab.description}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* ── Stats ────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total no Banco</p>
                <p className="text-2xl font-bold text-foreground">{resultCodes.length}</p>
              </div>
              <ListChecks className="h-8 w-8 text-blue-500/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Antes da ID Positiva</p>
                <p className="text-2xl font-bold text-amber-500">{beforeCount}</p>
              </div>
              <ShieldAlert className="h-8 w-8 text-amber-500/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Após ID Positiva</p>
                <p className="text-2xl font-bold text-green-500">{afterCount}</p>
              </div>
              <ShieldCheck className="h-8 w-8 text-green-500/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Filters ──────────────────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Tabulações Cadastradas no Banco</CardTitle>
          <CardDescription>
            Gerencie as tabulações ativas no banco de dados utilizadas pelo sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar tabulação..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={filterPhase}
              onValueChange={(v: "all" | "before" | "after") => setFilterPhase(v)}
            >
              <SelectTrigger className="w-full sm:w-[260px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as fases</SelectItem>
                <SelectItem value="before">Antes de confirmar os dados (CPF)</SelectItem>
                <SelectItem value="after">Após confirmar os dados (CPF)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Edit Form (inline) */}
      {editingCode && (
        <Card className="border-orange-500/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Edit className="h-4 w-4 text-orange-500" />
              Editando: {editingCode.name}
            </CardTitle>
            <CardDescription>Altere os dados da tabulação abaixo</CardDescription>
          </CardHeader>
          <CardContent>{formFields(true)}</CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          {filteredCodes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mb-4">
                <ListChecks className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground text-sm font-medium">
                {resultCodes.length === 0
                  ? "Nenhuma tabulação cadastrada no banco"
                  : "Nenhum resultado para os filtros"}
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="text-xs font-semibold min-w-[150px]">Nome</TableHead>
                    <TableHead className="text-xs font-semibold min-w-[200px]">Descrição</TableHead>
                    <TableHead className="text-xs font-semibold text-center min-w-[200px]">
                      Fase
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-center min-w-[80px]">
                      Ativo
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-right min-w-[100px] pr-4">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCodes.map((code) => (
                    <TableRow key={code.id} className="hover:bg-muted/20">
                      <TableCell className="py-3">
                        <span className="text-sm font-medium text-foreground">{code.name}</span>
                      </TableCell>
                      <TableCell className="py-3">
                        <span className="text-sm text-muted-foreground line-clamp-2">
                          {code.description || "-"}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 text-center">
                        {code.category === "before" ? (
                          <Badge
                            variant="outline"
                            className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                          >
                            <ShieldAlert className="h-3 w-3 mr-1" />
                            Antes da ID Positiva
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30"
                          >
                            <ShieldCheck className="h-3 w-3 mr-1" />
                            Após ID Positiva
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="py-3 text-center">
                        <Switch
                          checked={code.is_active}
                          onCheckedChange={() => handleToggleActive(code)}
                        />
                      </TableCell>
                      <TableCell className="py-3 text-right pr-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startEdit(code)}
                            className="h-8 w-8 hover:text-orange-500"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(code.id)}
                            className="h-8 w-8 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
