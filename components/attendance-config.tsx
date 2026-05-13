"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCachedProducts } from "@/hooks/use-cached-data"
import { getAttendanceTypes, getPersonTypes } from "@/lib/store"
import type { AttendanceConfig as AttendanceConfigType } from "@/lib/types"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Check } from "lucide-react"

interface AttendanceConfigProps {
  onStart: (config: AttendanceConfigType) => void
}

export function AttendanceConfig({ onStart }: AttendanceConfigProps) {
  const { products: productsData } = useCachedProducts()
  const [attendanceType, setAttendanceType] = useState<string | null>(null)
  const [personType, setPersonType] = useState<string | null>(null)
  const [product, setProduct] = useState<string>("")

  // Map products from Supabase to component format
  const products = useMemo(() => {
    return productsData
      .filter((p: any) => p.is_active)
      .map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        isActive: p.is_active,
        description: p.details?.description || "",
        attendanceTypes: p.details?.attendanceTypes || [],
        personTypes: p.details?.personTypes || [],
        scriptId: p.details?.scriptId || "",
      }))
  }, [productsData])

  // These are still from localStorage for now (UI config)
  const attendanceTypes = getAttendanceTypes()
  const personTypes = getPersonTypes()

  const isReceptivo = attendanceType === "receptivo"

  const filteredProducts = products.filter((p) => {
    if (!attendanceType) return false
    const matchesAttendance = p.attendanceTypes?.includes(attendanceType as any) ?? false
    // Para receptivo, não filtra por tipo de pessoa
    if (isReceptivo) return matchesAttendance
    if (!personType) return false
    const matchesPerson = p.personTypes?.includes(personType as any) ?? false
    return matchesAttendance && matchesPerson
  })

  const canSelectProduct = isReceptivo ? attendanceType !== null : attendanceType !== null && personType !== null

  const handleStart = () => {
    if (!attendanceType || !product) {
      alert("Por favor, complete todas as seleções antes de iniciar")
      return
    }
    if (!isReceptivo && !personType) {
      alert("Por favor, selecione o tipo de pessoa")
      return
    }

    onStart({
      attendanceType: attendanceType as any,
      personType: isReceptivo ? ("fisica" as any) : (personType as any),
      product,
    })
  }

  const handleReset = () => {
    setAttendanceType(null)
    setPersonType(null)
    setProduct("")
  }

  return (
    <div className="max-w-6xl mx-auto w-full">
      <TooltipProvider>
        <Card className="relative shadow-2xl border-0 bg-gradient-to-br from-white/5 via-white/5 to-white/0 dark:from-white/5 dark:via-white/5 dark:to-white/0 backdrop-blur-lg overflow-hidden">
          {/* Premium decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-500/20 to-amber-500/10 dark:from-orange-500/15 dark:to-amber-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-orange-500/20 to-amber-500/10 dark:from-orange-500/15 dark:to-amber-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>

          <CardHeader className="pb-8 relative z-10 text-center">
            <CardTitle className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 dark:from-orange-400 dark:via-orange-300 dark:to-amber-300 bg-clip-text text-transparent mb-2">
              Configuração de Atendimento
            </CardTitle>
            <p className="text-muted-foreground text-sm md:text-base mt-3 font-medium">
              Selecione as opções abaixo para personalizar seu atendimento
            </p>
          </CardHeader>
          <CardContent className="space-y-12 pb-12 relative z-10">
            {/* Tipo de atendimento - Now using dynamic options */}
            <div className="space-y-5">
              <div className="text-center">
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1">Tipo de Atendimento</h3>
                <p className="text-xs md:text-sm text-muted-foreground">Escolha como você deseja realizar o atendimento</p>
              </div>
              <div className="flex gap-4 justify-center flex-wrap">
                {attendanceTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant={attendanceType === type.value ? "default" : "outline"}
                    onClick={() => {
                      setAttendanceType(type.value)
                      setPersonType(null)
                      setProduct("")
                    }}
                    className={
                      attendanceType === type.value
                        ? "relative group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white dark:from-orange-400 dark:to-orange-500 dark:hover:from-orange-500 dark:hover:to-orange-600 font-semibold border-0 shadow-xl hover:shadow-2xl transition-all duration-300 min-w-[140px] h-12 text-sm uppercase tracking-wider overflow-hidden"
                        : "relative bg-card/50 hover:bg-card/80 text-foreground border-2 border-border/50 hover:border-orange-400/60 dark:hover:border-orange-500/60 min-w-[140px] h-12 text-sm font-semibold uppercase tracking-wider transition-all duration-300"
                    }
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      {attendanceType === type.value && (
                        <Check className="w-4 h-4 mr-2 absolute left-3" />
                      )}
                      <span>{type.label}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Pessoa - Oculto para Receptivo */}
            {!isReceptivo && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="text-center">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1">Tipo de Pessoa</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">Selecione o perfil de atendimento desejado</p>
                </div>
                <div className="flex gap-4 justify-center flex-wrap">
                  {personTypes.map((type) => (
                    <Button
                      key={type.id}
                      variant={personType === type.value ? "default" : "outline"}
                      onClick={() => setPersonType(type.value)}
                      className={
                        personType === type.value
                          ? "relative group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white dark:from-orange-400 dark:to-orange-500 dark:hover:from-orange-500 dark:hover:to-orange-600 font-semibold border-0 shadow-xl hover:shadow-2xl transition-all duration-300 min-w-[140px] h-12 text-sm uppercase tracking-wider overflow-hidden"
                          : "relative bg-card/50 hover:bg-card/80 text-foreground border-2 border-border/50 hover:border-orange-400/60 dark:hover:border-orange-500/60 min-w-[140px] h-12 text-sm font-semibold uppercase tracking-wider transition-all duration-300"
                      }
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        {personType === type.value && (
                          <Check className="w-4 h-4 mr-2 absolute left-3" />
                        )}
                        <span>{type.label}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {canSelectProduct && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="text-center">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1">Selecione o Produto</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">Escolha qual produto você deseja usar neste atendimento</p>
                </div>
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground bg-gradient-to-br from-white/5 to-white/0 dark:from-white/5 dark:to-white/0 rounded-2xl border-2 border-dashed border-border/50 backdrop-blur-sm">
                    <div className="text-5xl mb-3">○</div>
                    <p className="text-lg font-semibold">Nenhum produto disponível</p>
                    <p className="text-sm mt-2">Entre em contato com o administrador para configurar produtos.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProducts.map((prod) => (
                      <Tooltip key={prod.id}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => setProduct(prod.id)}
                            className={`group relative rounded-xl p-4 text-left transition-all duration-300 overflow-hidden border-2 ${
                              product === prod.id
                                ? "border-orange-500 bg-gradient-to-br from-orange-500/20 to-orange-600/10 dark:from-orange-500/15 dark:to-orange-600/5 shadow-xl"
                                : "border-border/50 bg-card/50 hover:bg-card/80 hover:border-orange-400/60 dark:hover:border-orange-500/60 shadow-md hover:shadow-lg"
                            }`}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/0 via-orange-300/0 to-orange-400/0 group-hover:from-orange-400/5 group-hover:via-orange-300/5 group-hover:to-orange-400/5 transition-all duration-300"></div>
                            <div className="relative z-10">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="text-sm md:text-base font-bold text-foreground uppercase tracking-wide">
                                  {prod.name}
                                </h4>
                                {product === prod.id && (
                                  <div className="rounded-full bg-gradient-to-r from-orange-500 to-orange-600 p-1.5 shadow-lg">
                                    <Check className="w-4 h-4 text-white" />
                                  </div>
                                )}
                              </div>
                              {prod.description && (
                                <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                                  {prod.description}
                                </p>
                              )}
                            </div>
                          </button>
                        </TooltipTrigger>
                        {prod.description && (
                          <TooltipContent side="top" className="max-w-xs">
                            <p>{prod.description}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </TooltipProvider>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-10 px-4">
        <Button
          size="lg"
          onClick={handleStart}
          disabled={!attendanceType || (!isReceptivo && !personType) || !product}
          className="relative group w-full sm:w-auto bg-gradient-to-r from-orange-500 via-orange-500 to-orange-600 hover:from-orange-600 hover:via-orange-600 hover:to-orange-700 dark:from-orange-400 dark:via-orange-400 dark:to-orange-500 dark:hover:from-orange-500 dark:hover:via-orange-500 dark:hover:to-orange-600 text-white font-bold px-8 sm:px-12 md:px-16 py-6 sm:py-7 md:py-8 text-base sm:text-lg md:text-xl shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 border-0 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 uppercase tracking-wider"
        >
          <span className="relative z-10">Iniciar Atendimento</span>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={handleReset}
          className="relative group w-full sm:w-auto bg-gradient-to-r from-amber-500/90 to-orange-500/90 hover:from-amber-600 hover:to-orange-600 dark:from-amber-600/90 dark:to-orange-600/90 dark:hover:from-amber-700 dark:hover:to-orange-700 text-white font-bold px-8 sm:px-12 md:px-16 py-6 sm:py-7 md:py-8 text-base sm:text-lg md:text-xl shadow-2xl hover:shadow-amber-500/40 transition-all duration-300 hover:scale-105 border-0 rounded-2xl uppercase tracking-wider"
        >
          <span className="relative z-10">Limpar Seleção</span>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Button>
      </div>
    </div>
  )
}
