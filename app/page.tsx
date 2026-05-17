"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { LoginForm } from "@/components/login-form"
import Image from "next/image"

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
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-orange-500 border-t-transparent mx-auto mb-4" />
          <p className="text-zinc-400 text-sm tracking-wide">Carregando...</p>
        </div>
      </div>
    )
  }

  if (user) return null

  return (
    <div className="relative min-h-screen min-h-dvh flex items-center justify-center overflow-hidden">
      {/* Imagem de fundo */}
      <Image
        src="/images/login-bg.jpg"
        alt=""
        fill
        className="object-cover"
        priority
        quality={90}
      />
      
      {/* Overlay escuro com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/95 via-zinc-900/90 to-zinc-950/95" />
      
      {/* Efeito de luz laranja no canto */}
      <div 
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(249,115,22,0.8) 0%, transparent 70%)" }}
      />
      <div 
        className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(234,88,12,0.6) 0%, transparent 70%)" }}
      />

      {/* Conteúdo principal */}
      <div className="relative z-10 w-full max-w-lg mx-4 sm:mx-6">
        {/* Card com efeito glass */}
        <div className="relative backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
          {/* Brilho no topo do card */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          {/* Header */}
          <div className="text-center mb-10">
            {/* Logo */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30 mb-6 ring-1 ring-white/10">
              <Image
                src="/images/grupo_roveri_logo.jpg"
                alt="Grupo Roveri"
                width={64}
                height={64}
                className="w-full h-full object-cover rounded-2xl"
                priority
              />
            </div>
            
            {/* Título */}
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-2">
              Roteiro
            </h1>
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-orange-500/50" />
              <span className="text-xs font-semibold tracking-[0.2em] text-orange-400 uppercase">
                Grupo Roveri
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-orange-500/50" />
            </div>
            <p className="text-zinc-400 text-sm">
              Sistema de Atendimento
            </p>
          </div>

          {/* Formulário */}
          <LoginForm />

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
            <span className="text-xs text-zinc-500">Sistema operacional</span>
          </div>
        </div>

        {/* Texto abaixo do card */}
        <p className="text-center text-xs text-zinc-600 mt-6">
          Acesso restrito a colaboradores autorizados
        </p>
      </div>
    </div>
  )
}
