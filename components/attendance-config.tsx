"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCachedProducts } from "@/hooks/use-cached-data"
import { getAttendanceTypes, getPersonTypes } from "@/lib/store"
import type { AttendanceConfig as AttendanceConfigType } from "@/lib/types"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Phone, PhoneIncoming, User, Building2, Package, Play, RotateCcw, Check, ChevronRight } from "lucide-react"

interface AttendanceConfigProps {
  onStart: (config: AttendanceConfigType) => void
}

const getAttendanceIcon = (value: string) => {
  switch (value) {
    case "ativo":
      return Phone
    case "receptivo":
      return PhoneIncoming
    default:
      return Phone
  }
}

const getPersonIcon = (value: string) => {
  switch (value) {
    case "fisica":
      return User
    case "juridica":
      return Building2
    default:
      return User
  }
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

  // Calculate progress steps
  const currentStep = !attendanceType ? 1 : (!isReceptivo && !personType) ? 2 : !product ? 3 : 4
  const totalSteps = isReceptivo ? 2 : 3

  return (
    <div className="max-w-4xl mx-auto px-4">
      <TooltipProvider>
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {Array.from({ length: totalSteps }, (_, i) => {
            const stepNum = i + 1
            const isCompleted = currentStep > stepNum
            const isActive = currentStep === stepNum
            return (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                    ${isCompleted 
                      ? "bg-primary text-primary-foreground" 
                      : isActive 
                        ? "bg-primary/20 text-primary border-2 border-primary" 
                        : "bg-muted text-muted-foreground"
                    }
                  `}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : stepNum}
                </div>
                {i < totalSteps - 1 && (
                  <ChevronRight className={`w-5 h-5 ${isCompleted ? "text-primary" : "text-muted-foreground/50"}`} />
                )}
              </div>
            )
          })}
        </div>

        <Card className="relative border border-border/50 bg-card/80 backdrop-blur-sm shadow-xl overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
          
          <CardContent className="relative z-10 p-6 md:p-8 lg:p-10 space-y-8">
            {/* Tipo de atendimento */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-4">
                  Tipo de Atendimento
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
              </div>
              <div className="flex gap-3 justify-center flex-wrap">
                {attendanceTypes.map((type) => {
                  const Icon = getAttendanceIcon(type.value)
                  const isSelected = attendanceType === type.value
                  return (
                    <button
                      key={type.id}
                      onClick={() => {
                        setAttendanceType(type.value)
                        setPersonType(null)
                        setProduct("")
                      }}
                      className={`
                        group relative flex items-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-200
                        ${isSelected
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]"
                          : "bg-secondary/50 hover:bg-secondary text-foreground border border-border hover:border-primary/50 hover:shadow-md"
                        }
                      `}
                    >
                      <div className={`
                        p-2 rounded-lg transition-colors
                        ${isSelected ? "bg-primary-foreground/20" : "bg-background group-hover:bg-primary/10"}
                      `}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span>{type.label}</span>
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary-foreground rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Tipo de Pessoa - Oculto para Receptivo */}
            {attendanceType && !isReceptivo && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex items-center justify-center gap-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-4">
                    Tipo de Pessoa
                  </h3>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                </div>
                <div className="flex gap-3 justify-center flex-wrap">
                  {personTypes.map((type) => {
                    const Icon = getPersonIcon(type.value)
                    const isSelected = personType === type.value
                    return (
                      <button
                        key={type.id}
                        onClick={() => setPersonType(type.value)}
                        className={`
                          group relative flex items-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-200
                          ${isSelected
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]"
                            : "bg-secondary/50 hover:bg-secondary text-foreground border border-border hover:border-primary/50 hover:shadow-md"
                          }
                        `}
                      >
                        <div className={`
                          p-2 rounded-lg transition-colors
                          ${isSelected ? "bg-primary-foreground/20" : "bg-background group-hover:bg-primary/10"}
                        `}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span>{type.label}</span>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary-foreground rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-primary" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Seleção de Produto */}
            {canSelectProduct && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex items-center justify-center gap-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-4">
                    Selecione o Produto
                  </h3>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                </div>
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground bg-secondary/30 rounded-xl border border-dashed border-border">
                    <Package className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">Nenhum produto disponivel</p>
                    <p className="text-sm mt-1">Entre em contato com o administrador.</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3 justify-center">
                    {filteredProducts.map((prod) => {
                      const isSelected = product === prod.id
                      return (
                        <Tooltip key={prod.id}>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => setProduct(prod.id)}
                              className={`
                                group relative flex items-center gap-3 px-5 py-3 rounded-xl font-medium transition-all duration-200
                                ${isSelected
                                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]"
                                  : "bg-secondary/50 hover:bg-secondary text-foreground border border-border hover:border-primary/50 hover:shadow-md"
                                }
                              `}
                            >
                              <Package className="w-4 h-4" />
                              <span className="uppercase text-sm">{prod.name}</span>
                              {isSelected && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary-foreground rounded-full flex items-center justify-center">
                                  <Check className="w-3 h-3 text-primary" />
                                </div>
                              )}
                            </button>
                          </TooltipTrigger>
                          {prod.description && (
                            <TooltipContent side="top" className="max-w-xs">
                              <p>{prod.description}</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </TooltipProvider>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
        <Button
          size="lg"
          onClick={handleStart}
          disabled={!attendanceType || (!isReceptivo && !personType) || !product}
          className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-10 py-6 text-lg shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          <span className="relative z-10 flex items-center gap-3">
            <Play className="w-5 h-5" />
            Iniciar Atendimento
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={handleReset}
          className="group flex items-center gap-3 px-8 py-6 text-lg font-medium border-2 border-border hover:border-muted-foreground/50 hover:bg-secondary/50 transition-all duration-300 rounded-xl"
        >
          <RotateCcw className="w-5 h-5 transition-transform group-hover:-rotate-180 duration-500" />
          Limpar
        </Button>
      </div>
    </div>
  )
}
