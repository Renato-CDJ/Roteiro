"use client"

import type React from "react"
import { useState, useCallback, memo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { AlertCircle, Mail, Lock, Sun, Moon, ShieldCheck, User, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { useTheme } from "next-themes"
import Image from "next/image"

// Usuario operador padrao registrado no codigo (sem necessidade de banco de dados)
const DEFAULT_OPERATOR = {
  id: "default-operator-001",
  username: "operador",
  fullName: "Operador",
  email: "operador@gruporoveri.com",
  role: "operator" as const,
  isActive: true,
  isOnline: true,
}

type LoginMode = "selection" | "admin" | "operator"

export const LoginForm = memo(function LoginForm() {
  const [loginMode, setLoginMode] = useState<LoginMode>("selection")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { theme, setTheme } = useTheme()
  const { login, loginAsOperator } = useAuth()

  const handleAdminSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setError("")
      setIsLoading(true)

      try {
        // Validar email
        if (!email.trim()) {
          setError("Usuario e obrigatorio")
          setIsLoading(false)
          return
        }

        // Senha e obrigatoria para admins
        if (!password) {
          setError("Senha obrigatoria para administradores")
          setIsLoading(false)
          return
        }
        
        const result = await login(email.trim(), password)
        
        if (!result.success) {
          setError(result.error || "Erro ao fazer login")
          setIsLoading(false)
          return
        }
        
        // Login bem sucedido - redirecionar para admin
        window.location.href = "/admin"
      } catch (err) {
        setError("Erro ao fazer login")
        setIsLoading(false)
      }
    },
    [email, password, login],
  )

  const handleOperatorAccess = useCallback(async () => {
    setIsLoading(true)
    setError("")

    try {
      // Login como operador padrao (sem necessidade de credenciais)
      loginAsOperator(DEFAULT_OPERATOR)
      
      // Redirecionar para a pagina do operador
      window.location.href = "/operator"
    } catch (err) {
      setError("Erro ao acessar como operador")
      setIsLoading(false)
    }
  }, [loginAsOperator])

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark")
  }, [theme, setTheme])

  const handleBack = useCallback(() => {
    setLoginMode("selection")
    setEmail("")
    setPassword("")
    setError("")
  }, [])

  return (
    <Card className="w-full max-w-md mx-auto bg-white dark:bg-zinc-900 border-0 shadow-2xl overflow-hidden rounded-2xl">
      {/* Header com gradiente */}
      <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 px-8 pt-8 pb-12">
        {/* Botao tema */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          title="Alternar tema"
          className="absolute top-4 right-4 h-10 w-10 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        {/* Logo */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-white/30 shadow-lg mb-4">
            <Image
              src="/images/grupo_roveri_logo.jpg"
              alt="Grupo Roveri"
              width={80}
              height={80}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Grupo Roveri</h1>
          <p className="text-sm text-white/80 mt-1">Sistema de Roteiros</p>
        </div>
      </div>

      <CardContent className="px-8 pb-8 -mt-6">
        {/* Card interno com conteudo */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 border border-zinc-100 dark:border-zinc-700">
          {/* Selecao de modo de login */}
          {loginMode === "selection" && (
            <div className="space-y-5">
              <p className="text-center text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Selecione o tipo de acesso
              </p>
              
              {/* Botao ADM */}
              <button
                onClick={() => setLoginMode("admin")}
                className="w-full group relative overflow-hidden rounded-xl bg-zinc-900 dark:bg-zinc-700 p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                    <ShieldCheck className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="block text-base font-semibold text-white">Administrador</span>
                    <span className="block text-xs text-zinc-400">Acesso com credenciais</span>
                  </div>
                  <ArrowLeft className="h-5 w-5 text-white/60 rotate-180 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Botao Operador */}
              <button
                onClick={handleOperatorAccess}
                disabled={isLoading}
                className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 p-4 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-base font-semibold text-white">Entrando...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <span className="block text-base font-semibold text-white">Operador</span>
                      <span className="block text-xs text-white/80">Acesso direto ao roteiro</span>
                    </div>
                    <ArrowLeft className="h-5 w-5 text-white/80 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
            </div>
          )}

          {/* Formulario de login ADM */}
          {loginMode === "admin" && (
            <div className="space-y-5">
              {/* Botao voltar */}
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-orange-500 dark:text-zinc-400 dark:hover:text-orange-400 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </button>

              <div className="flex flex-col items-center gap-2 py-2">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-700">
                  <ShieldCheck className="h-7 w-7 text-zinc-700 dark:text-zinc-300" />
                </div>
                <span className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
                  Acesso Administrador
                </span>
              </div>

              <form onSubmit={handleAdminSubmit} className="space-y-4">
                {/* Usuario */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                    Usuario
                  </label>
                  <div className="relative flex items-stretch">
                    <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center bg-zinc-100 dark:bg-zinc-700 rounded-l-lg border border-r-0 border-zinc-200 dark:border-zinc-600">
                      <Mail className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                    </div>
                    <Input
                      id="email"
                      type="text"
                      placeholder="seu.usuario"
                      value={email}
                      onChange={(e) => {
                        const value = e.target.value.split("@")[0]
                        setEmail(value)
                        setError("")
                      }}
                      required
                      autoComplete="username"
                      disabled={isLoading}
                      className="h-12 pl-14 pr-4 flex-1 min-w-0 text-sm bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-lg rounded-r-none border-r-0"
                    />
                    <div className="h-12 px-3 flex items-center bg-zinc-100 dark:bg-zinc-700 border border-l-0 border-zinc-200 dark:border-zinc-600 rounded-r-lg">
                      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 whitespace-nowrap">@gruporoveri.com</span>
                    </div>
                  </div>
                </div>

                {/* Senha */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                    Senha
                  </label>
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center bg-zinc-100 dark:bg-zinc-700 rounded-l-lg border border-r-0 border-zinc-200 dark:border-zinc-600">
                      <Lock className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      disabled={isLoading}
                      className="h-12 pl-14 text-sm bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-lg transition-all"
                    />
                  </div>
                </div>

                {/* Erro */}
                {error && (
                  <Alert
                    variant="destructive"
                    className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm font-medium">{error}</AlertDescription>
                  </Alert>
                )}

                {/* Botao Entrar */}
                <Button
                  type="submit"
                  className="w-full h-12 text-sm font-semibold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-orange-500/25 rounded-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Entrando...
                    </span>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>
            </div>
          )}

          {/* Erro geral (para modo selecao) */}
          {loginMode === "selection" && error && (
            <Alert
              variant="destructive"
              className="mt-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm font-medium">{error}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-zinc-400 dark:text-zinc-500 mt-6">
          Grupo Roveri - Todos os direitos reservados
        </p>
      </CardContent>
    </Card>
  )
})
