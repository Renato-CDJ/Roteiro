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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (user) return null

  return (
    <div className="min-h-screen flex">
      {/* Painel esquerdo — identidade visual */}
      <div className="hidden lg:flex lg:w-[52%] bg-login-panel flex-col justify-between p-12 relative overflow-hidden">
        {/* Detalhe geométrico sutil no canto */}
        <div
          className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-[0.06]"
          style={{ background: "hsl(var(--primary))", transform: "translate(40%, -40%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-56 h-56 rounded-full opacity-[0.05]"
          style={{ background: "hsl(var(--primary))", transform: "translate(-40%, 40%)" }}
        />

        {/* Logo / marca topo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-black text-sm leading-none">R</span>
          </div>
          <span className="text-login-panel-foreground font-semibold tracking-wide text-sm">
            Grupo Roveri
          </span>
        </div>

        {/* Conteudo central */}
        <div className="relative z-10 flex flex-col gap-6">
          <div>
            <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              Sistema de Atendimento
            </p>
            <h1 className="text-login-panel-foreground text-5xl font-black tracking-tight leading-[1.1] text-balance">
              Roteiro
            </h1>
            <p className="text-login-panel-muted text-lg mt-3 leading-relaxed text-pretty max-w-sm">
              Plataforma integrada para gestão e acompanhamento de atendimentos em tempo real.
            </p>
          </div>

          {/* Separador */}
          <div className="w-12 h-px bg-primary opacity-60" />

          {/* Stats / info */}
          <div className="flex gap-8">
            <div>
              <p className="text-login-panel-foreground text-2xl font-bold">100%</p>
              <p className="text-login-panel-muted text-xs mt-0.5">Rastreabilidade</p>
            </div>
            <div>
              <p className="text-login-panel-foreground text-2xl font-bold">Real-time</p>
              <p className="text-login-panel-muted text-xs mt-0.5">Monitoramento</p>
            </div>
          </div>
        </div>

        {/* Rodape */}
        <div className="relative z-10">
          <p className="text-login-panel-muted text-xs">
            &copy; {new Date().getFullYear()} Grupo Roveri. Todos os direitos reservados.
          </p>
        </div>
      </div>

      {/* Painel direito — formulário */}
      <div className="flex-1 flex flex-col items-center justify-center bg-background p-6 sm:p-10 relative">
        {/* Cabeçalho mobile */}
        <div className="lg:hidden mb-10 text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-black text-xs">R</span>
            </div>
            <span className="font-semibold text-foreground">Grupo Roveri</span>
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Roteiro</h1>
          <p className="text-muted-foreground text-sm mt-1">Sistema de Atendimento</p>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Bem-vindo</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Insira suas credenciais para acessar o sistema.
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  )
}
