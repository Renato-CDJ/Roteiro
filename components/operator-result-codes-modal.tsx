"use client"

import { useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useCachedResultCodes } from "@/hooks/use-cached-data"
import { Search, Tags, Loader2, ZoomIn, ZoomOut, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface OperatorResultCodesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OperatorResultCodesModal({ open, onOpenChange }: OperatorResultCodesModalProps) {
  const { resultCodes: resultCodesData, loading } = useCachedResultCodes()
  const [searchQuery, setSearchQuery] = useState("")
  const [globalZoom, setGlobalZoom] = useState(100)
  const [activeCategory, setActiveCategory] = useState<"all" | "before" | "after">("all")

  // Map Supabase data to component format
  const tabulations = useMemo(() => resultCodesData
    .filter((t: any) => t.is_active)
    .map((t: any) => ({
      id: t.id,
      name: t.name,
      description: t.description || "",
      color: t.color || "#3b82f6",
      category: t.category || "before",
      isActive: t.is_active,
    })), [resultCodesData])

  // Filter by search
  const filteredTabulations = useMemo(() => {
    let result = tabulations
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
      )
    }
    if (activeCategory !== "all") {
      result = result.filter((t) => t.category === activeCategory)
    }
    return result
  }, [tabulations, searchQuery, activeCategory])

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

  // Contadores totais (sem filtro de categoria)
  const totalBefore = useMemo(() => {
    let result = tabulations.filter((t) => t.category === "before")
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
      )
    }
    return result.length
  }, [tabulations, searchQuery])

  const totalAfter = useMemo(() => {
    let result = tabulations.filter((t) => t.category === "after")
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
      )
    }
    return result.length
  }, [tabulations, searchQuery])

  const renderTabulationCard = (tabulation: typeof tabulations[0]) => (
    <div
      key={tabulation.id}
      className="rounded-md border border-border bg-card hover:bg-muted/50 transition-colors duration-150"
      style={{ borderLeftWidth: "3px", borderLeftColor: tabulation.color }}
    >
      <div className="flex items-start gap-3 p-3">
        <div
          className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5"
          style={{ backgroundColor: tabulation.color }}
        />
        <div className="flex-1 min-w-0">
          <h4
            className="font-medium text-foreground leading-tight"
            style={{ fontSize: `${globalZoom}%` }}
          >
            {tabulation.name}
          </h4>
          {tabulation.description && (
            <p
              className="text-muted-foreground leading-relaxed mt-0.5"
              style={{ fontSize: `${Math.round(globalZoom * 0.85)}%` }}
            >
              {tabulation.description}
            </p>
          )}
        </div>
      </div>
    </div>
  )

  const CategorySection = ({ 
    type, 
    tabulations, 
    title, 
    subtitle
  }: { 
    type: "before" | "after"
    tabulations: typeof beforeTabulations
    title: string
    subtitle: string
  }) => (
    <div className="rounded-lg border border-border overflow-hidden">
      {/* Header da secao */}
      <div className={cn(
        "px-4 py-3 border-b",
        type === "before" ? "bg-amber-50/50 dark:bg-amber-950/20" : "bg-emerald-50/50 dark:bg-emerald-950/20"
      )}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          </div>
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded",
            type === "before" 
              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300" 
              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
          )}>
            {tabulations.length} {tabulations.length === 1 ? "opcao" : "opcoes"}
          </span>
        </div>
      </div>
      
      {/* Lista de tabulacoes */}
      <div className="p-3 bg-card">
        {tabulations.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p className="text-sm">Nenhuma tabulacao encontrada</p>
          </div>
        ) : (
          <div className="grid gap-2">
            {tabulations.map((t) => renderTabulationCard(t))}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-5xl w-[95vw] h-[90vh] flex flex-col p-0 gap-0 overflow-hidden [&>button]:z-50">
        {/* Header */}
        <div className="p-5 border-b bg-card">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <Tags className="h-5 w-5 text-muted-foreground" />
              Tabulacoes Disponiveis
            </DialogTitle>
            <DialogDescription className="text-sm">
              Selecione a tabulacao correta de acordo com o momento do atendimento
            </DialogDescription>
          </DialogHeader>
          
          {/* Barra de busca e controles */}
          <div className="flex items-center gap-3 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar tabulacao..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
            <div className="flex items-center gap-1 border rounded-md p-0.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setGlobalZoom(Math.max(80, globalZoom - 10))}
                className="h-7 w-7"
                title="Diminuir texto"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </Button>
              <span className="text-xs font-medium w-10 text-center text-muted-foreground">{globalZoom}%</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setGlobalZoom(Math.min(150, globalZoom + 10))}
                className="h-7 w-7"
                title="Aumentar texto"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filtros por categoria */}
          <div className="flex items-center gap-2 mt-3">
            <Button
              variant={activeCategory === "all" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveCategory("all")}
              className="h-7 text-xs"
            >
              Todas ({totalBefore + totalAfter})
            </Button>
            <Button
              variant={activeCategory === "before" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveCategory("before")}
              className="h-7 text-xs"
            >
              Antes do CPF ({totalBefore})
            </Button>
            <Button
              variant={activeCategory === "after" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveCategory("after")}
              className="h-7 text-xs"
            >
              Depois do CPF ({totalAfter})
            </Button>
            {searchQuery && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSearchQuery("")}
                className="text-xs h-7 ml-auto"
              >
                Limpar busca
              </Button>
            )}
          </div>
        </div>

        {/* Dica informativa */}
        <div className="px-5 py-2 bg-muted/50 border-b">
          <div className="flex items-start gap-2 text-muted-foreground">
            <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p className="text-xs">
              <span className="font-medium">Antes do CPF:</span> Use quando o cliente ainda nao confirmou os dados. 
              <span className="font-medium ml-2">Depois do CPF:</span> Use apos o cliente confirmar CPF e dados pessoais.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="p-5">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">Carregando tabulacoes...</p>
              </div>
            ) : tabulations.length === 0 ? (
              <div className="text-center py-20">
                <Tags className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
                <p className="font-medium">Nenhuma tabulacao cadastrada</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Entre em contato com o administrador
                </p>
              </div>
            ) : filteredTabulations.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-3 opacity-50" />
                <p className="font-medium">Nenhum resultado encontrado</p>
                <p className="text-sm mt-1">Tente buscar por outro termo</p>
              </div>
            ) : (
              <div className={cn(
                "grid gap-5",
                activeCategory === "all" ? "lg:grid-cols-2" : "grid-cols-1 max-w-2xl mx-auto"
              )}>
                {/* Coluna: Antes da confirmacao de CPF */}
                {(activeCategory === "all" || activeCategory === "before") && (
                  <CategorySection
                    type="before"
                    tabulations={beforeTabulations}
                    title="Antes da confirmacao de dados"
                    subtitle="Cliente NAO confirmou CPF/dados"
                  />
                )}

                {/* Coluna: Depois da confirmacao de CPF */}
                {(activeCategory === "all" || activeCategory === "after") && (
                  <CategorySection
                    type="after"
                    tabulations={afterTabulations}
                    title="Depois da confirmacao de dados"
                    subtitle="Cliente JA confirmou CPF/dados"
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t bg-card">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Antes do CPF</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Depois do CPF</span>
              </div>
            </div>
            <span>{filteredTabulations.length} tabulacoes</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
