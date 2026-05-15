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

export function OperatorResultCodesModal({ open, onOpenChange }: OperatorResultCodesModalProps) {
  const { resultCodes: resultCodesData, loading } = useCachedResultCodes()
  const [searchQuery, setSearchQuery] = useState("")
  const [globalZoom, setGlobalZoom] = useState(100)

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
            ) : tabulations.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Tags className="h-8 w-8 text-muted-foreground" />
                </div>
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
