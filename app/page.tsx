"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { LoginForm } from "@/components/login-form"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/operator")
      }
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-orange-500 border-t-transparent mx-auto mb-3"></div>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">Carregando...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 md:p-6">
        <div className="w-full max-w-md">
          {/* Titulo */}
          <div className="mb-10 text-center">
            <h1 className="text-6xl md:text-7xl font-black tracking-tight mb-4">
              <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 bg-clip-text text-transparent animate-fade-in">
                Roteiro
              </span>
            </h1>
            
            {/* Linha animada */}
            <div className="relative h-1 w-24 mx-auto mb-5 overflow-hidden rounded-full bg-orange-200/30 dark:bg-orange-900/30">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 animate-line-expand origin-center" />
            </div>
            
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium animate-fade-in">
              Sistema de Atendimento
            </p>
          </div>

          {/* Formulario */}
          <LoginForm />
        </div>
        
        {/* Rodape */}
        <p className="absolute bottom-4 text-xs text-zinc-400 dark:text-zinc-600">
          Grupo Roveri
        </p>
    </div>
  )
}
