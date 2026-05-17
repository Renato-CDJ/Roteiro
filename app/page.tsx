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
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-orange-500 border-t-transparent mx-auto mb-3" />
          <p className="text-zinc-400 text-sm">Carregando...</p>
        </div>
      </div>
    )
  }

  if (user) return null

  return (
    <div className="min-h-screen min-h-dvh flex flex-col lg:flex-row bg-zinc-950 login-cursor">
      {/* Painel esquerdo — branding */}
      <div className="relative hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col items-start justify-between p-12 xl:p-16 overflow-hidden">
        {/* Fundo com linhas de luz */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 20% 50%, rgba(234,88,12,0.18) 0%, transparent 70%), radial-gradient(ellipse 60% 80% at 80% 80%, rgba(251,146,60,0.10) 0%, transparent 70%)",
          }}
        />

        {/* Grade sutil */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Linha vertical de destaque */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-orange-500 to-transparent opacity-60" />

        {/* Conteúdo */}
        <div className="relative z-10 flex flex-col h-full justify-between">
          {/* Topo — logo text */}
          <div>
            <span className="text-xs font-semibold tracking-[0.3em] text-orange-400 uppercase">
              Grupo Roveri
            </span>
          </div>

          {/* Centro — título grande */}
          <div className="py-8">
            <h1 className="text-[7rem] xl:text-[9rem] font-black leading-none tracking-tighter text-white select-none">
              Roteiro
            </h1>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-[2px] w-12 bg-orange-500" />
              <p className="text-zinc-400 text-base font-medium tracking-wide">
                Sistema de Atendimento
              </p>
            </div>

            <p className="mt-8 text-zinc-500 text-sm leading-relaxed max-w-sm">
              Plataforma centralizada para gerenciamento de roteiros, atendimento e monitoramento de equipes.
            </p>
          </div>

          {/* Rodapé */}
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs text-zinc-600 font-medium">Sistema ativo</span>
          </div>
        </div>
      </div>

      {/* Divisor */}
      <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-zinc-700 to-transparent" />

      {/* Painel direito — formulário */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 lg:p-12 bg-zinc-950">
        {/* Header mobile */}
        <div className="lg:hidden text-center mb-8">
          <span className="text-xs font-semibold tracking-[0.3em] text-orange-400 uppercase block mb-2">
            Grupo Roveri
          </span>
          <h1 className="text-5xl font-black text-white tracking-tighter">Roteiro</h1>
          <div className="mt-2 flex items-center justify-center gap-2">
            <div className="h-[2px] w-8 bg-orange-500" />
            <p className="text-zinc-400 text-sm">Sistema de Atendimento</p>
            <div className="h-[2px] w-8 bg-orange-500" />
          </div>
        </div>

        {/* Formulário */}
        <div className="w-full max-w-sm">
          <div className="mb-6 hidden lg:block">
            <h2 className="text-2xl font-bold text-white">Bem-vindo</h2>
            <p className="text-zinc-500 text-sm mt-1">Acesse sua conta para continuar</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
