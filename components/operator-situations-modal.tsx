"use client"

import { useState, useMemo, useCallback, memo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useCachedSituations } from "@/hooks/use-cached-data"
import { Search, X, ChevronRight, AlertCircle } from "lucide-react"

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

// Modal de detalhe
const DetailModal = memo(function DetailModal({
  open,
  onClose,
  situation,
}: {
  open: boolean
  onClose: () => void
  situation: SituationData | null
}) {
  if (!open || !situation) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-[95vw] max-h-[85vh] p-0 gap-0 overflow-hidden border-border/50 flex flex-col">
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="text-white text-lg font-semibold flex items-center justify-center gap-2 text-center">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="break-words">{situation.name}</span>
            </DialogTitle>
          </DialogHeader>
        </div>
        
        <ScrollArea className="flex-1 min-h-0 max-h-[60vh]">
          <div className="p-4 space-y-3">
            {situation.description ? (
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-1">Descrição</h4>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
                  {situation.description}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Sem informações adicionais disponíveis
              </p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
})

export const OperatorSituationsModal = memo(function OperatorSituationsModal({
  open,
  onOpenChange,
}: OperatorSituationsModalProps) {
  const [search, setSearch] = useState("")
  const [selectedSituation, setSelectedSituation] = useState<SituationData | null>(null)
  const [showDetail, setShowDetail] = useState(false)

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

  const handleSelectSituation = useCallback((situation: SituationData) => {
    setSelectedSituation(situation)
    setShowDetail(true)
  }, [])

  const handleCloseDetail = useCallback(() => {
    setShowDetail(false)
    setSelectedSituation(null)
  }, [])

  const handleClose = useCallback(() => {
    onOpenChange(false)
    setSearch("")
    setSelectedSituation(null)
    setShowDetail(false)
  }, [onOpenChange])

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl w-[95vw] h-[85vh] p-0 gap-0 flex flex-col border-border/50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 flex-shrink-0">
            <DialogHeader>
              <DialogTitle className="text-white text-lg font-semibold flex items-center gap-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                Situações
              </DialogTitle>
            </DialogHeader>
            
            {/* Busca */}
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
              <Input
                placeholder="Buscar situação..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/60 h-9 text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          
          {/* Contador */}
          <div className="px-4 py-2 bg-muted/30 border-b border-border/50 text-xs text-muted-foreground flex-shrink-0 flex items-center justify-between">
            <span>
              {filteredSituations.length === situations.length 
                ? `${situations.length} situações`
                : `${filteredSituations.length} de ${situations.length} situações`
              }
            </span>
            <Badge variant="secondary" className="text-xs">
              {situations.length}
            </Badge>
          </div>
          
          {/* Lista com scroll */}
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-3 space-y-1.5">
              {filteredSituations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Nenhuma situação encontrada
                </div>
              ) : (
                filteredSituations.map((situation) => (
                  <button
                    key={situation.id}
                    onClick={() => handleSelectSituation(situation)}
                    className="w-full text-left px-3 py-2.5 rounded-lg border border-border/50 bg-card hover:bg-amber-500/5 hover:border-amber-500/40 transition-colors group overflow-hidden"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                      <span className="flex-1 min-w-0 text-sm font-medium text-foreground group-hover:text-amber-500 transition-colors truncate">
                        {situation.name}
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 group-hover:text-amber-500 transition-colors" />
                    </div>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Modal de detalhe */}
      <DetailModal
        open={showDetail}
        onClose={handleCloseDetail}
        situation={selectedSituation}
      />
    </>
  )
})
