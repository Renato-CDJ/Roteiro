"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { LoginForm } from "@/components/login-form"

// Componente animado para o titulo "Roteiro" com efeito de iluminacao
function AnimatedTitle() {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <h1 
      className="relative text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-4 cursor-default select-none group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Camada de glow atras do texto */}
      <span 
        className="absolute inset-0 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 bg-clip-text text-transparent blur-2xl transition-all duration-500 ease-out pointer-events-none"
        style={{
          opacity: isHovered ? 0.8 : 0,
          transform: isHovered ? "scale(1.05)" : "scale(1)",
        }}
        aria-hidden="true"
      >
        Roteiro
      </span>
      
      {/* Segundo glow mais suave e difuso */}
      <span 
        className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-orange-600 bg-clip-text text-transparent blur-3xl transition-all duration-700 ease-out pointer-events-none"
        style={{
          opacity: isHovered ? 0.5 : 0,
          transform: isHovered ? "scale(1.1)" : "scale(1)",
        }}
        aria-hidden="true"
      >
        Roteiro
      </span>
      
      {/* Texto principal */}
      <span 
        className="relative bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 bg-clip-text text-transparent transition-all duration-300 ease-out"
        style={{
          filter: isHovered ? "brightness(1.15)" : "brightness(1)",
        }}
      >
        Roteiro
      </span>
    </h1>
  )
}

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
    <div className="min-h-screen min-h-dvh flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 md:p-6 overflow-x-hidden">
        <div className="w-full max-w-md px-2 sm:px-0">
          {/* Titulo */}
          <div className="mb-8 sm:mb-10 text-center">
            <AnimatedTitle />
            
            {/* Linha estatica */}
            <div className="h-1 w-24 mx-auto mb-5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500" />
            
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
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
