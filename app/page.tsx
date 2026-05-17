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
    <div className="min-h-screen min-h-dvh flex bg-zinc-950">
      {/* Lado Esquerdo - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Fundo com gradiente animado */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black" />
        
        {/* Círculos de luz animados */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-600/15 rounded-full blur-3xl animate-pulse-slow-delay" />
        
        {/* Partículas flutuantes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="particle particle-1" />
          <div className="particle particle-2" />
          <div className="particle particle-3" />
          <div className="particle particle-4" />
          <div className="particle particle-5" />
        </div>

        {/* Conteúdo central */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12">
          {/* Logo */}
          <div className="mb-8 relative">
            <div className="w-24 h-24 rounded-3xl overflow-hidden ring-2 ring-orange-500/30 shadow-2xl shadow-orange-500/20">
              <Image
                src="/images/grupo_roveri_logo.jpg"
                alt="Logo"
                width={96}
                height={96}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="absolute -inset-2 bg-orange-500/20 rounded-3xl blur-xl -z-10 animate-pulse-slow" />
          </div>

          {/* Nome com efeito de digitação */}
          <h1 className="text-7xl xl:text-8xl font-black tracking-tight mb-6">
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-200 to-orange-400 animate-gradient-x">
              Roteiro
            </span>
          </h1>

          {/* Linha decorativa animada */}
          <div className="relative w-48 h-1 mb-8 overflow-hidden rounded-full bg-zinc-800">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 animate-shimmer-bar" />
          </div>

          {/* Subtítulo */}
          <p className="text-xl text-zinc-400 font-light tracking-wide text-center max-w-md">
            Sistema Inteligente de<br />
            <span className="text-orange-400 font-medium">Atendimento ao Cliente</span>
          </p>

          {/* Stats ou features */}
          <div className="mt-16 grid grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider">Disponível</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-orange-400">100%</div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider">Seguro</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">Rápido</div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider">Acesso</div>
            </div>
          </div>
        </div>

        {/* Borda direita com gradiente */}
        <div className="absolute right-0 inset-y-0 w-px bg-gradient-to-b from-transparent via-orange-500/30 to-transparent" />
      </div>

      {/* Lado Direito - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        {/* Fundo sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-950" />
        
        {/* Padrão de pontos */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }} />

        <div className="relative z-10 w-full max-w-md">
          {/* Header mobile */}
          <div className="lg:hidden text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-orange-500/30 shadow-xl mb-4">
              <Image
                src="/images/grupo_roveri_logo.jpg"
                alt="Logo"
                width={64}
                height={64}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-orange-400 mb-2">
              Roteiro
            </h1>
            <p className="text-zinc-500 text-sm">Sistema de Atendimento</p>
          </div>

          {/* Card do formulário */}
          <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-3xl p-8 sm:p-10 shadow-2xl">
            {/* Header do card */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Bem-vindo de volta
              </h2>
              <p className="text-zinc-500 text-sm">
                Faça login para acessar o sistema
              </p>
            </div>

            {/* Formulário */}
            <LoginForm />
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
              <span className="text-xs text-zinc-600">Sistema operacional</span>
            </div>
            <p className="text-xs text-zinc-700">
              Acesso restrito a colaboradores autorizados
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
