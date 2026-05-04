"use client"

import { useState, useMemo, useCallback, memo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCachedSituations } from "@/hooks/use-cached-data"
import { Search, AlertCircle, ZoomIn, ZoomOut, ChevronDown, ChevronUp, Eye, X } from "lucide-react"

interface OperatorSituationsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface SituationData {
  id: string
  name: string
  description?: string
  color?: string
}

export const OperatorSituationsModal = memo(function OperatorSituationsModal({
  open,
  onOpenChange,
}: OperatorSituationsModalProps) {
  const [search, setSearch] = useState("")
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({})
  const [globalZoom, setGlobalZoom] = useState(100)
  const [selectedSituation, setSelectedSituation] = useState<SituationData | null>(null)

  const { situations: situationsRaw } = useCachedSituations()

  const situations = useMemo<SituationData[]>(() => 
    situationsRaw
      .filter((s: any) => s.is_active !== false)
      .map((s: any) => ({
        id: s.id,
        name: s.name,
        description: s.description || "",
        color: s.color || "#f59e0b",
      }))
  , [situationsRaw])

  const filteredSituations = useMemo(() => {
    if (!search.trim()) return situations
    const query = search.toLowerCase()
    return situations.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query)
    )
  }, [situations, search])

  const toggleExpand = useCallback((id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }, [])

  const handleClose = useCallback(() => {
    onOpenChange(false)
    setSearch("")
    setExpandedCards({})
    setSelectedSituation(null)
  }, [onOpenChange])

  const openDescriptionModal = useCallback((situation: SituationData) => {
    setSelectedSituation(situation)
  }, [])

  const closeDescriptionModal = useCallback(() => {
    setSelectedSituation(null)
  }, [])

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl w-[95vw] h-[85vh] p-0 gap-0 flex flex-col overflow-hidden">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-white">
              <div className="p-2 bg-white/20 rounded-lg">
                <AlertCircle className="h-6 w-6" />
              </div>
              Situacoes
            </DialogTitle>
            <DialogDescription className="text-amber-100 mt-2">
              Consulte as orientacoes para cada tipo de situacao
            </DialogDescription>
          </DialogHeader>
          
          {/* Barra de busca e controles */}
          <div className="flex items-center gap-3 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-200" />
              <Input
                placeholder="Buscar situacao..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-amber-200 focus-visible:ring-white/30"
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
        <div className="px-6 py-3 bg-muted/50 border-b flex items-center justify-between flex-shrink-0">
          <span className="text-sm text-muted-foreground">
            {filteredSituations.length} {filteredSituations.length === 1 ? "situacao encontrada" : "situacoes encontradas"}
          </span>
          {search && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSearch("")}
              className="text-xs h-7"
            >
              Limpar busca
            </Button>
          )}
        </div>

        {/* Lista de situacoes */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-6 space-y-3">
            {filteredSituations.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="font-medium">Nenhuma situacao encontrada</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {search ? "Tente buscar por outro termo" : "Nenhuma situacao disponivel no momento"}
                </p>
              </div>
            ) : (
              filteredSituations.map((situation) => {
                const isExpanded = expandedCards[situation.id] ?? false
                const shouldTruncate = (situation.description?.length || 0) > 200

                return (
                  <Card
                    key={situation.id}
                    className="group border hover:border-amber-500/50 transition-all duration-200 hover:shadow-md"
                  >
                    <CardContent className="p-0 overflow-hidden">
                      <div 
                        className="flex items-start gap-4 p-4 cursor-pointer w-full"
                        onClick={() => shouldTruncate && toggleExpand(situation.id)}
                      >
                        {/* Icone da situacao */}
                        <div 
                          className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
                          style={{ 
                            background: `linear-gradient(135deg, ${situation.color}, ${situation.color}dd)`,
                            boxShadow: `0 4px 14px ${situation.color}40`
                          }}
                        >
                          <AlertCircle className="h-6 w-6" />
                        </div>
                        
                        {/* Conteudo */}
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <h3 
                            className="font-semibold text-foreground group-hover:text-amber-500 transition-colors break-words mb-2"
                            style={{ fontSize: `${globalZoom}%` }}
                          >
                            {situation.name}
                          </h3>
                          {situation.description && (
                            <p
                              className={`text-muted-foreground leading-relaxed transition-all break-words ${!isExpanded && shouldTruncate ? "line-clamp-2" : ""}`}
                              style={{ fontSize: `${globalZoom * 0.875}%` }}
                            >
                              {situation.description}
                            </p>
                          )}
                          
                          {/* Botoes de acao */}
                          <div className="flex items-center gap-2 mt-2">
                            {shouldTruncate && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs text-amber-500 hover:text-amber-600 hover:bg-amber-500/10 p-0"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleExpand(situation.id)
                                }}
                              >
                                {isExpanded ? (
                                  <>
                                    <ChevronUp className="h-3 w-3 mr-1" />
                                    Mostrar menos
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="h-3 w-3 mr-1" />
                                    Ler mais
                                  </>
                                )}
                              </Button>
                            )}
                            {situation.description && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs border-amber-500/50 text-amber-500 hover:text-amber-600 hover:bg-amber-500/10 hover:border-amber-500"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openDescriptionModal(situation)
                                }}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Visualizar
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </ScrollArea>
      </DialogContent>

      {/* Modal de Descricao Completa */}
      <Dialog open={!!selectedSituation} onOpenChange={(open) => !open && closeDescriptionModal()}>
        <DialogContent className="max-w-2xl w-[90vw] max-h-[80vh] p-0 gap-0 flex flex-col overflow-hidden">
          {selectedSituation && (
            <>
              {/* Header do modal de descricao */}
              <div 
                className="p-6 text-white flex-shrink-0"
                style={{ 
                  background: `linear-gradient(135deg, ${selectedSituation.color}, ${selectedSituation.color}dd)`,
                }}
              >
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold flex items-center gap-3 text-white">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    {selectedSituation.name}
                  </DialogTitle>
                  <DialogDescription className="text-white/80 mt-2">
                    Descricao completa da situacao
                  </DialogDescription>
                </DialogHeader>
              </div>

              {/* Controle de zoom */}
              <div className="px-6 py-3 bg-muted/50 border-b flex items-center justify-end flex-shrink-0">
                <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setGlobalZoom(Math.max(80, globalZoom - 10))}
                    className="h-8 w-8"
                    title="Diminuir texto"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium w-12 text-center">{globalZoom}%</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setGlobalZoom(Math.min(150, globalZoom + 10))}
                    className="h-8 w-8"
                    title="Aumentar texto"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Conteudo da descricao */}
              <ScrollArea className="flex-1 min-h-0">
                <div className="p-6">
                  <div 
                    className="prose prose-sm max-w-none text-foreground leading-relaxed whitespace-pre-wrap"
                    style={{ fontSize: `${globalZoom}%` }}
                  >
                    {selectedSituation.description || "Nenhuma descricao disponivel."}
                  </div>
                </div>
              </ScrollArea>

              {/* Footer */}
              <div className="px-6 py-4 border-t bg-muted/30 flex justify-end flex-shrink-0">
                <Button
                  variant="outline"
                  onClick={closeDescriptionModal}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Fechar
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Dialog>
  )
})
