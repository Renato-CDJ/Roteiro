"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { LoginForm } from "@/components/login-form"

// Componente animado para o titulo "Roteiro"
function AnimatedTitle() {
  const [isHovered, setIsHovered] = useState(false)
  const letters = "Roteiro".split("")
  
  return (
    <h1 
      className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-4 cursor-default select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="inline-flex overflow-hidden">
        {letters.map((letter, index) => (
          <span
            key={index}
            className="inline-block bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 bg-clip-text text-transparent transition-all duration-300 ease-out"
            style={{
              transform: isHovered 
                ? `translateY(${Math.sin(index * 0.8) * -8}px) rotate(${Math.sin(index * 0.5) * 3}deg) scale(1.05)` 
                : "translateY(0) rotate(0) scale(1)",
              transitionDelay: isHovered ? `${index * 40}ms` : `${(letters.length - index) * 30}ms`,
              filter: isHovered ? "brightness(1.2)" : "brightness(1)",
              textShadow: isHovered ? "0 0 30px rgba(249, 115, 22, 0.4)" : "none",
            }}
          >
            {letter}
          </span>
        ))}
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
