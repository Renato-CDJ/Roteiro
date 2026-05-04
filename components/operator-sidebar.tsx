"use client"

import type React from "react"
import { useState, useMemo, useCallback, memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, CalendarIcon, Maximize2, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PromiseCalendarInline } from "@/components/promise-calendar"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  const [activeSection, setActiveSection] = useState<"calendar" | "checkTabulation">("calendar")
  
  // Estado para modais - apenas um ativo por vez
  const [modalState, setModalState] = useState<{
    type: "detail" | null
    item?: ListItemData | null
    title?: string
  }>({ type: null })

  // Estado de selecao
  const [selectedIds, setSelectedIds] = useState({
    tabulation: "",
  })





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

  if (!isOpen) return null

  return (
    <aside className="w-full md:w-[320px] lg:w-[380px] max-w-full border-l border-border/50 bg-card flex flex-col h-full shrink-0">
      {/* Tabs compactas */}
      <div className="border-b border-border/50 px-1.5 pt-1 pb-0 flex gap-1 flex-shrink-0">
        {[
          { id: "calendar" as const, icon: CalendarIcon, label: "Calendario" },
          { id: "checkTabulation" as const, icon: CheckCircle2, label: "Verificar", badge: currentStep?.tabulations?.length },
        ].map(({ id, icon: Icon, label, badge }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-t-md text-xs font-medium transition-colors relative border-b-2 ${
              activeSection === id
                ? "bg-orange-500/10 text-orange-500 border-orange-500"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40 border-transparent"
            }`}
          >
            <Icon className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{label}</span>
            {badge && badge > 0 && activeSection !== id && (
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            )}
          </button>
        ))}
      </div>

      {/* Conteudo - sem padding excessivo */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-2">
          {activeSection === "calendar" && (
            <div className="space-y-2">
              <PromiseCalendarInline productCategory={productCategory} />
              
              <div className="border-t border-border/50 pt-2">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="p-0.5 rounded bg-orange-500">
                    <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                  </div>
                  <span className="text-[10px] font-semibold text-muted-foreground leading-tight">Tabulacao recomendada para esta tela</span>
                </div>
                <RecommendedTabulation 
                  currentStep={currentStep} 
                  onExpand={handleExpandTabulation}
                />
              </div>
            </div>
          )}

          {activeSection === "checkTabulation" && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-lg bg-orange-500/10">
                  <CheckCircle2 className="h-3.5 w-3.5 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold">Tabulacao Recomendada</h3>
                  <p className="text-[10px] text-muted-foreground">De acordo com a sua tela atual</p>
                </div>
              </div>
              <RecommendedTabulation 
                currentStep={currentStep} 
                onExpand={handleExpandTabulation}
              />
            </div>
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


    </aside>
  )
})
