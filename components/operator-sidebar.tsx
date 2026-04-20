"use client"

import type React from "react"
import { useState, useMemo, useCallback, memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCachedSituations, useCachedChannels } from "@/hooks/use-cached-data"
import { CheckCircle2, AlertCircle, Radio, Search, CalendarIcon, Maximize2, X, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PromiseCalendarInline } from "@/components/promise-calendar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import type { ScriptStep } from "@/lib/types"

interface OperatorSidebarProps {
  isOpen: boolean
  productCategory?: "habitacional" | "comercial" | "cartao" | "outros"
  currentStep?: ScriptStep | null
}

// Tipo para item generico
interface ListItemData {
  id: string
  name: string
  description?: string
  color?: string
  contact?: string
}

// Componente de item de lista ultra-leve
const SimpleListItem = memo(function SimpleListItem({
  item,
  onClick,
  isSelected,
}: {
  item: ListItemData
  onClick: () => void
  isSelected?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2.5 rounded-lg border transition-colors duration-150 overflow-hidden ${
        isSelected 
          ? "bg-orange-500/10 border-orange-500/50 text-orange-500" 
          : "bg-card border-border/50 hover:bg-muted/50 hover:border-border text-foreground"
      }`}
    >
      <div className="flex items-center gap-2 w-full min-w-0">
        {item.color && (
          <div 
            className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
            style={{ backgroundColor: item.color }} 
          />
        )}
        <span className="text-sm font-medium truncate flex-1 min-w-0">{item.name}</span>
        <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
      </div>
    </button>
  )
})

// Modal de detalhe ultra-leve
const DetailModal = memo(function DetailModal({
  open,
  onClose,
  title,
  description,
  icon,
  color,
}: {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  icon?: React.ReactNode
  color?: string
}) {
  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden border-border/50">
        {/* Header compacto - titulo centralizado */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4">
          <DialogHeader>
            <DialogTitle className="text-white text-lg font-semibold flex items-center justify-center gap-2 text-center">
              {color && (
                <div 
                  className="w-3 h-3 rounded-full ring-2 ring-white/30 flex-shrink-0" 
                  style={{ backgroundColor: color }} 
                />
              )}
              {icon}
              <span className="truncate">{title}</span>
            </DialogTitle>
          </DialogHeader>
        </div>
        
        {/* Conteudo */}
        <div className="p-4">
          {description ? (
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Sem descricao disponivel
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
})

// Modal de lista completa otimizado
const FullListModal = memo(function FullListModal({
  open,
  onClose,
  title,
  items,
  type,
  onItemClick,
}: {
  open: boolean
  onClose: () => void
  title: string
  items: ListItemData[]
  type: "situation" | "channel"
  onItemClick: (item: ListItemData) => void
}) {
  const [search, setSearch] = useState("")

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items
    const query = search.toLowerCase()
    return items.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query)
    )
  }, [items, search])

  // Limitar itens visiveis para performance
  const visibleItems = useMemo(() => filteredItems.slice(0, 100), [filteredItems])

  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-[90vw] max-h-[80vh] p-0 gap-0 flex flex-col border-border/50">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="text-white text-lg font-semibold">
              {title}
            </DialogTitle>
          </DialogHeader>
          
          {/* Busca */}
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
            <Input
              placeholder="Buscar..."
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
        <div className="px-4 py-2 bg-muted/30 border-b border-border/50 text-xs text-muted-foreground flex-shrink-0">
          {filteredItems.length === items.length 
            ? `${items.length} itens`
            : `${filteredItems.length} de ${items.length} itens`
          }
        </div>
        
        {/* Lista com scroll */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-3 space-y-1.5">
            {visibleItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Nenhum item encontrado
              </div>
            ) : (
              visibleItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onItemClick(item)}
                  className="w-full text-left p-3 rounded-lg border border-border/50 bg-card hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    {item.color && (
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0 mt-1 ring-2 ring-border/50" 
                        style={{ backgroundColor: item.color }} 
                      />
                    )}
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <h4 className="font-medium text-sm text-foreground group-hover:text-orange-500 transition-colors truncate">
                        {item.name}
                      </h4>
                      {(item.description || item.contact) && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {type === "channel" ? item.contact : item.description}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 group-hover:text-orange-500 transition-colors" />
                  </div>
                </button>
              ))
            )}
            {filteredItems.length > 100 && (
              <p className="text-center py-2 text-xs text-muted-foreground">
                Mostrando 100 de {filteredItems.length}. Use a busca para filtrar.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
})

// Componente de conteudo para cada aba - lazy loaded
const TabContent = memo(function TabContent({
  type,
  items,
  selectedId,
  onSelectItem,
  onViewAll,
}: {
  type: "situation" | "channel"
  items: ListItemData[]
  selectedId: string
  onSelectItem: (item: ListItemData) => void
  onViewAll: () => void
}) {
  const titles = {
    situation: "Situacoes",
    channel: "Canais",
  }

  // Limitar itens para renderizacao inicial rapida - reduzido para 15 para melhor fit na tela
  const visibleItems = useMemo(() => items.slice(0, 15), [items])

  return (
    <div className="space-y-3 overflow-hidden">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{titles[type]}</h3>
        <Badge variant="secondary" className="text-xs">
          {items.length}
        </Badge>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start text-xs h-8 border-dashed"
        onClick={onViewAll}
      >
        <Search className="h-3.5 w-3.5 mr-2" />
        Ver todos e buscar
      </Button>
      
      <div className="space-y-1 overflow-hidden">
        {visibleItems.map((item) => (
          <SimpleListItem
            key={item.id}
            item={item}
            onClick={() => onSelectItem(item)}
            isSelected={selectedId === item.id}
          />
        ))}
        {items.length > 15 && (
          <button
            onClick={onViewAll}
            className="w-full text-center py-2 text-xs text-orange-500 hover:underline"
          >
            +{items.length - 15} mais...
          </button>
        )}
      </div>
    </div>
  )
})

// Componente de tabulacao recomendada
const RecommendedTabulation = memo(function RecommendedTabulation({
  currentStep,
  onExpand,
}: {
  currentStep?: ScriptStep | null
  onExpand: (tab: { name: string; description: string }) => void
}) {
  if (!currentStep?.tabulations?.length) {
    return (
      <div className="rounded-lg border border-dashed border-border/50 p-4 text-center">
        <CheckCircle2 className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
        <p className="text-xs text-muted-foreground">
          Nenhuma tabulacao recomendada para esta tela
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {currentStep.tabulations.map((tabulation, index) => (
        <button
          key={tabulation.id || index}
          onClick={() => onExpand({ name: tabulation.name, description: tabulation.description })}
          className="w-full text-left p-3 rounded-lg border border-orange-200/50 dark:border-orange-500/30 bg-orange-50/50 dark:bg-orange-500/5 hover:bg-orange-100/50 dark:hover:bg-orange-500/10 transition-colors group"
        >
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-foreground line-clamp-1">
                {tabulation.name}
              </h4>
              {tabulation.description && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {tabulation.description}
                </p>
              )}
            </div>
            <Maximize2 className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </div>
        </button>
      ))}
    </div>
  )
})

export const OperatorSidebar = memo(function OperatorSidebar({ 
  isOpen, 
  productCategory, 
  currentStep 
}: OperatorSidebarProps) {
  const [activeSection, setActiveSection] = useState<"calendar" | "checkTabulation" | "situation" | "channel">("calendar")
  
  // Estado para modais - apenas um ativo por vez
  const [modalState, setModalState] = useState<{
    type: "detail" | "list" | null
    listType?: "situation" | "channel"
    item?: ListItemData | null
    title?: string
  }>({ type: null })

  // Estado de selecao
  const [selectedIds, setSelectedIds] = useState({
    tabulation: "",
    situation: "",
    channel: "",
  })

  // Dados do cache - ja memoizados pelo hook
  const { situations: situationsRaw } = useCachedSituations()
  const { channels: channelsRaw } = useCachedChannels()

  // Mapear dados uma vez
  const situations = useMemo<ListItemData[]>(() => 
    situationsRaw
      .filter((s: any) => s.is_active !== false)
      .map((s: any) => ({
        id: s.id,
        name: s.name,
        description: s.description || "",
        color: s.color || "#6b7280",
      }))
  , [situationsRaw])

  const channels = useMemo<ListItemData[]>(() => 
    channelsRaw
      .filter((c: any) => c.is_active !== false)
      .map((c: any) => ({
        id: c.id,
        name: c.name,
        description: c.description || "",
        contact: c.icon || "",
      }))
  , [channelsRaw])

  // Handlers memoizados
  const handleSelectItem = useCallback((type: "situation" | "channel", item: ListItemData) => {
    setSelectedIds(prev => ({ ...prev, [type]: item.id }))
    setModalState({ 
      type: "detail", 
      item,
      title: item.name,
    })
  }, [])

  const handleOpenList = useCallback((type: "situation" | "channel") => {
    const titles = {
      situation: "Todas as Situacoes", 
      channel: "Todos os Canais",
    }
    setModalState({ type: "list", listType: type, title: titles[type] })
  }, [])

  const handleCloseModal = useCallback(() => {
    setModalState({ type: null })
  }, [])

  const handleExpandTabulation = useCallback((tab: { name: string; description: string }) => {
    setModalState({
      type: "detail",
      item: { id: "recommended", name: tab.name, description: tab.description },
      title: tab.name,
    })
  }, [])

  // Items para lista atual
  const currentListItems = useMemo(() => {
    if (modalState.listType === "situation") return situations
    if (modalState.listType === "channel") return channels
    return []
  }, [modalState.listType, situations, channels])

  if (!isOpen) return null

  return (
    <aside className="w-full md:w-[320px] lg:w-[380px] max-w-full border-l border-border/50 bg-card flex flex-col h-full shrink-0">
      {/* Tabs */}
      <div className="border-b border-border/50 p-1.5 flex gap-1">
        {[
          { id: "calendar" as const, icon: CalendarIcon, label: "Calen." },
          { id: "checkTabulation" as const, icon: CheckCircle2, label: "Verif.", badge: currentStep?.tabulations?.length },
          { id: "situation" as const, icon: AlertCircle, label: "Situ." },
          { id: "channel" as const, icon: Radio, label: "Canal" },
        ].map(({ id, icon: Icon, label, badge }) => (
          <Button
            key={id}
            variant={activeSection === id ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveSection(id)}
            className={`flex-1 flex-col h-auto py-1.5 px-1 gap-0.5 relative ${
              activeSection === id
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "hover:bg-muted/50"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="text-[10px] font-medium">{label}</span>
            {badge && badge > 0 && activeSection !== id && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-500 ring-2 ring-card" />
            )}
          </Button>
        ))}
      </div>

      {/* Conteudo */}
      <ScrollArea className="flex-1">
        <div className="p-3">
          {activeSection === "calendar" && (
            <div className="space-y-4">
              <PromiseCalendarInline productCategory={productCategory} />
              
              <div className="border-t border-border/50 pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1 rounded bg-orange-500">
                    <CheckCircle2 className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-xs font-semibold">Tabulacao Recomendada de acordo com a sua tela atual</span>
                </div>
                <RecommendedTabulation 
                  currentStep={currentStep} 
                  onExpand={handleExpandTabulation}
                />
              </div>
            </div>
          )}

          {activeSection === "checkTabulation" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Tabulacao Recomendada</h3>
                  <p className="text-xs text-muted-foreground">De acordo com a sua tela atual</p>
                </div>
              </div>
              <RecommendedTabulation 
                currentStep={currentStep} 
                onExpand={handleExpandTabulation}
              />
            </div>
          )}

          {activeSection === "situation" && (
            <TabContent
              type="situation"
              items={situations}
              selectedId={selectedIds.situation}
              onSelectItem={(item) => handleSelectItem("situation", item)}
              onViewAll={() => handleOpenList("situation")}
            />
          )}

          {activeSection === "channel" && (
            <TabContent
              type="channel"
              items={channels}
              selectedId={selectedIds.channel}
              onSelectItem={(item) => handleSelectItem("channel", item)}
              onViewAll={() => handleOpenList("channel")}
            />
          )}
        </div>
      </ScrollArea>

      {/* Modal de detalhe */}
      <DetailModal
        open={modalState.type === "detail"}
        onClose={handleCloseModal}
        title={modalState.item?.name || ""}
        description={modalState.item?.description || modalState.item?.contact}
        color={modalState.item?.color}
      />

      {/* Modal de lista */}
      <FullListModal
        open={modalState.type === "list"}
        onClose={handleCloseModal}
        title={modalState.title || ""}
        items={currentListItems}
        type={modalState.listType || "tabulation"}
        onItemClick={(item) => {
          handleCloseModal()
          if (modalState.listType) {
            handleSelectItem(modalState.listType, item)
          }
        }}
      />
    </aside>
  )
})
