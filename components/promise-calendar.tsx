"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, CheckCircle2, Info, CreditCard, Building2, Home, AlertTriangle } from "lucide-react"
import { getMaxPromiseDate, isHoliday, isSaturday, isSunday, getNextBusinessDay } from "@/lib/business-days"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type ProductType = "cartao" | "comercial" | "habitacional"
type ProductCategory = "habitacional" | "comercial" | "cartao" | "outros" | "boleto_pre_formatado"

interface PromiseCalendarInlineProps {
  productCategory?: ProductCategory
}

export function PromiseCalendarInline({ productCategory }: PromiseCalendarInlineProps) {
  const [selectedProduct, setSelectedProduct] = useState<ProductType | "">("")
  const [selectedDate, setSelectedDate] = useState<Date>()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  useEffect(() => {
    if (productCategory === "comercial") {
      setSelectedProduct("comercial")
      setSelectedDate(undefined)
    } else if (productCategory === "habitacional") {
      setSelectedProduct("habitacional")
      setSelectedDate(undefined)
    } else if (productCategory === "cartao") {
      setSelectedProduct("cartao")
      setSelectedDate(undefined)
    } else if (productCategory === "outros") {
      setSelectedProduct("")
      setSelectedDate(undefined)
    }
  }, [productCategory])

  const handleProductSelect = (value: ProductType) => {
    if (!productCategory || productCategory === "outros") {
      setSelectedProduct(value)
      setSelectedDate(undefined)
    }
  }

  const maxDate = selectedProduct ? getMaxPromiseDate(selectedProduct) : undefined

  const isDateInRange = (date: Date) => {
    if (!selectedProduct) return false

    const dateTime = new Date(date)
    dateTime.setHours(0, 0, 0, 0)
    const todayTime = new Date(today)
    todayTime.setHours(0, 0, 0, 0)

    // Data anterior a hoje não está disponível
    if (dateTime < todayTime) return false

    // REGRA: Sábados NÃO são permitidos como data de vencimento
    if (isSaturday(dateTime)) return false

    // Domingos NÃO são permitidos como data de vencimento
    if (isSunday(dateTime)) return false

    // Feriados nacionais não estão disponíveis
    if (isHoliday(dateTime)) return false

    if (maxDate) {
      const maxDateTime = new Date(maxDate)
      maxDateTime.setHours(0, 0, 0, 0)
      if (dateTime > maxDateTime) return false
    }

    return true
  }

  // Função para ajustar data quando cliente quer pagar no sábado
  // Move automaticamente para o próximo dia útil
  const adjustDateIfSaturday = (date: Date): Date => {
    if (isSaturday(date)) {
      return getNextBusinessDay(date)
    }
    return date
  }

  const productOptions = [
    {
      value: "cartao" as ProductType,
      name: "Cartão",
      deadline: "D+6 (6 dias corridos)",
      icon: CreditCard,
    },
    {
      value: "comercial" as ProductType,
      name: "Comercial",
      deadline: "D+9 (9 dias corridos)",
      icon: Building2,
    },
    {
      value: "habitacional" as ProductType,
      name: "Habitacional",
      deadline: "D+9 (9 dias corridos)",
      icon: Home,
    },
  ]

  if (productCategory === "boleto_pre_formatado") {
    return (
      <Card className="border-border bg-card">
        <CardHeader className="pb-1 pt-3 px-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
            <CalendarIcon className="h-3.5 w-3.5 text-primary" />
            Calendário de Promessas
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="flex flex-col items-center justify-center py-4 text-center space-y-2">
            <AlertTriangle className="h-8 w-8 text-amber-500" />
            <p className="text-xs font-medium text-muted-foreground">
              De acordo com a data do boleto, não pode ser alterado em hipótese alguma.
            </p>
            <p className="text-[10px] text-muted-foreground">
              Categoria: <span className="font-semibold">Boleto Pré-Formatado</span>
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (productCategory === "outros") {
    return (
      <Card className="border-border bg-card">
        <CardHeader className="pb-1 pt-3 px-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
            <CalendarIcon className="h-3.5 w-3.5 text-primary" />
            Calendário de Promessas
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="flex flex-col items-center justify-center py-4 text-center space-y-2">
            <AlertTriangle className="h-8 w-8 text-amber-500" />
            <p className="text-xs font-medium text-muted-foreground">
              O produto selecionado não possui datas de promessa disponíveis.
            </p>
            <p className="text-[10px] text-muted-foreground">
              Categoria: <span className="font-semibold">Outros</span>
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-1 pt-3 px-3">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
          <CalendarIcon className="h-3.5 w-3.5 text-primary" />
          Calendário de Promessas
          {productCategory !== undefined && (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 cursor-default">
                    <Info className="h-3 w-3" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  Tipo selecionado automaticamente:{" "}
                  {productCategory === "comercial"
                    ? "Comercial"
                    : productCategory === "habitacional"
                      ? "Habitacional"
                      : "Cartão"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardTitle>
        {!productCategory && (
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Selecione o tipo de produto e escolha uma data disponível
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-3 px-3 pb-3">
        {!productCategory && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <CheckCircle2 className="h-3 w-3 text-primary" />
              Tipo de Produto
            </label>
            <TooltipProvider delayDuration={200}>
              <div className="flex gap-2 justify-center">
                {productOptions.map((product) => {
                  const Icon = product.icon
                  const isSelected = selectedProduct === product.value
                  return (
                    <Tooltip key={product.value}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleProductSelect(product.value)}
                          className={`w-16 h-16 p-1.5 rounded-xl transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
                            isSelected
                              ? "bg-orange-500 dark:bg-gradient-to-br dark:from-orange-500 dark:to-amber-500 shadow-lg scale-105"
                              : "bg-muted/30 hover:bg-muted/50"
                          }`}
                        >
                          <Icon className={`h-5 w-5 ${isSelected ? "text-white" : "text-muted-foreground"}`} />
                          <p
                            className={`font-semibold text-[9px] text-center leading-tight ${isSelected ? "text-white" : "text-foreground"}`}
                          >
                            {product.name}
                          </p>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-orange-500 text-white border-orange-600">
                        <p className="text-xs font-semibold">Prazo: {product.deadline}</p>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
            </TooltipProvider>
          </div>
        )}

        {!selectedProduct ? (
          <div className="space-y-2">
            {/* Current Date Calendar */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-muted/50 rounded-md">
                <CalendarIcon className="h-3 w-3 text-primary" />
                <p className="text-[10px] font-semibold text-foreground">Data Atual</p>
              </div>
              <div className="flex justify-center p-1 bg-card rounded-lg border border-border overflow-hidden">
                <Calendar
                  mode="single"
                  selected={today}
                  disabled={(date) => date.getTime() !== today.getTime()}
                  className="rounded-lg scale-[0.82] origin-top"
                  classNames={{
                    day_today: "bg-primary text-primary-foreground font-bold ring-2 ring-primary/20",
                    months: "flex flex-col space-y-1",
                    month: "space-y-1 w-full",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-xs font-semibold",
                    nav: "space-x-1 flex items-center",
                    nav_button:
                      "h-6 w-6 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-accent rounded-md transition-colors",
                    table: "w-full border-collapse",
                    head_cell: "text-muted-foreground rounded-md w-8 font-semibold text-[10px]",
                    cell: "h-7 w-7 text-center text-xs p-0 relative",
                    day: "h-7 w-7 p-0 font-medium text-xs hover:bg-accent rounded-md transition-colors",
                  }}
                />
              </div>
            </div>

            {/* Info Message */}
            <div className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 rounded-md">
              <Info className="h-3 w-3 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-blue-900 dark:text-blue-100 font-medium">
                Selecione um tipo de produto acima para visualizar as datas disponíveis
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Available Dates Calendar */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-muted/50 rounded-md">
                <CalendarIcon className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                <p className="text-[10px] font-semibold text-foreground">Datas Disponíveis</p>
              </div>
              <div className="flex justify-center p-1 bg-card rounded-lg border border-border overflow-hidden">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => !isDateInRange(date)}
                  className="rounded-lg scale-[0.82] origin-top"
                  modifiers={{
                    available: (date) => isDateInRange(date) && date.getTime() !== today.getTime(),
                  }}
                  modifiersClassNames={{
                    available:
                      "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-100 font-semibold hover:bg-emerald-200 dark:hover:bg-emerald-800 border-2 border-emerald-400 dark:border-emerald-600",
                  }}
                  classNames={{
                    day_today: "bg-primary text-primary-foreground font-bold ring-2 ring-primary/20",
                    day_selected:
                      "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-white font-bold hover:bg-emerald-700 dark:hover:bg-emerald-600 ring-2 ring-emerald-400 dark:ring-emerald-600",
                    day_disabled: "text-muted-foreground opacity-30 line-through cursor-not-allowed",
                    months: "flex flex-col space-y-1",
                    month: "space-y-1 w-full",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-xs font-semibold",
                    nav: "space-x-1 flex items-center",
                    nav_button:
                      "h-6 w-6 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-accent rounded-md transition-colors",
                    table: "w-full border-collapse",
                    head_cell: "text-muted-foreground rounded-md w-8 font-semibold text-[10px]",
                    cell: "h-7 w-7 text-center text-xs p-0 relative",
                    day: "h-7 w-7 p-0 font-medium text-xs hover:bg-accent rounded-md transition-colors",
                  }}
                />
              </div>
            </div>

            {/* Selected Date Display */}
            {selectedDate && (
              <div className="bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40 border-l-4 border-emerald-500 rounded-md p-2">
                <div className="flex items-center gap-1 mb-0.5">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-[10px] font-bold text-emerald-900 dark:text-emerald-100">Data Selecionada</p>
                </div>
                <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 ml-4">
                  {selectedDate.toLocaleDateString("pt-BR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}

            {/* Regras de Contagem */}
            <div className="bg-orange-50 dark:bg-orange-950/40 border-l-4 border-orange-500 rounded-lg p-2 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                <p className="text-xs font-bold text-orange-900 dark:text-orange-100">Regras de Contagem</p>
              </div>
              <ul className="text-[10px] text-orange-900 dark:text-orange-100 ml-5 space-y-1 list-disc">
                <li>Contagem em dias corridos (inclui sab/dom/feriados)</li>
                <li>Sábados, domingos e feriados <strong>NÃO</strong> podem ser agendado o pagamento</li>
                <li>Se cliente informar sábado, agendar o pagamento para próximo dia útil</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
