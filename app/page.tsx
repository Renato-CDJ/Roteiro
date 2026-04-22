"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { LoginForm } from "@/components/login-form"

// Componente animado para o titulo "Roteiro" com efeito de holofotes de palco
function AnimatedTitle() {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <div 
      className="relative cursor-default select-none py-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Holofote esquerdo - feixe de luz vindo do canto superior esquerdo */}
      <div 
        className="absolute pointer-events-none transition-all duration-700 ease-out"
        style={{
          top: "-180px",
          left: "-150px",
          width: "320px",
          height: "380px",
          background: "linear-gradient(145deg, rgba(251, 146, 60, 0.6) 0%, rgba(251, 146, 60, 0.25) 25%, rgba(251, 146, 60, 0.08) 50%, transparent 70%)",
          clipPath: "polygon(40% 0%, 100% 100%, 0% 100%)",
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? "scale(1) rotate(-12deg)" : "scale(0.7) rotate(-12deg)",
          transformOrigin: "top center",
          filter: "blur(8px)",
        }}
      />
      {/* Núcleo brilhante do holofote esquerdo */}
      <div 
        className="absolute pointer-events-none transition-all duration-700 ease-out"
        style={{
          top: "-160px",
          left: "-100px",
          width: "200px",
          height: "280px",
          background: "linear-gradient(145deg, rgba(251, 191, 36, 0.5) 0%, rgba(251, 146, 60, 0.2) 30%, transparent 60%)",
          clipPath: "polygon(45% 0%, 90% 100%, 10% 100%)",
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? "scale(1) rotate(-12deg)" : "scale(0.7) rotate(-12deg)",
          transformOrigin: "top center",
          filter: "blur(4px)",
        }}
      />
      
      {/* Holofote direito - feixe de luz vindo do canto superior direito */}
      <div 
        className="absolute pointer-events-none transition-all duration-700 ease-out"
        style={{
          top: "-180px",
          right: "-150px",
          width: "320px",
          height: "380px",
          background: "linear-gradient(-145deg, rgba(251, 146, 60, 0.6) 0%, rgba(251, 146, 60, 0.25) 25%, rgba(251, 146, 60, 0.08) 50%, transparent 70%)",
          clipPath: "polygon(60% 0%, 100% 100%, 0% 100%)",
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? "scale(1) rotate(12deg)" : "scale(0.7) rotate(12deg)",
          transformOrigin: "top center",
          transitionDelay: "80ms",
          filter: "blur(8px)",
        }}
      />
      {/* Núcleo brilhante do holofote direito */}
      <div 
        className="absolute pointer-events-none transition-all duration-700 ease-out"
        style={{
          top: "-160px",
          right: "-100px",
          width: "200px",
          height: "280px",
          background: "linear-gradient(-145deg, rgba(251, 191, 36, 0.5) 0%, rgba(251, 146, 60, 0.2) 30%, transparent 60%)",
          clipPath: "polygon(55% 0%, 90% 100%, 10% 100%)",
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? "scale(1) rotate(12deg)" : "scale(0.7) rotate(12deg)",
          transformOrigin: "top center",
          transitionDelay: "80ms",
          filter: "blur(4px)",
        }}
      />
      
      {/* Brilho central onde os holofotes se encontram */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-500 ease-out"
        style={{
          width: "160%",
          height: "140%",
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(251, 146, 60, 0.2) 0%, rgba(251, 146, 60, 0.08) 40%, transparent 70%)",
          opacity: isHovered ? 1 : 0,
        }}
      />
      {/* Reflexo no chão */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-600 ease-out"
        style={{
          bottom: "-20px",
          width: "80%",
          height: "40px",
          background: "radial-gradient(ellipse 100% 100% at 50% 0%, rgba(251, 146, 60, 0.15) 0%, transparent 80%)",
          opacity: isHovered ? 1 : 0,
          filter: "blur(8px)",
        }}
      />
      
      {/* Texto principal */}
      <h1 
        className="relative text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-4 transition-all duration-300"
        style={{ 
          filter: isHovered ? "drop-shadow(0 0 20px rgba(251, 146, 60, 0.3))" : "none",
        }}
      >
        <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
          Roteiro
        </span>
      </h1>
    </div>
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
