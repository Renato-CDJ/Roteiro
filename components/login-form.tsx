"use client"

import type React from "react"
import { useState, useCallback, memo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { AlertCircle, Mail, Lock, Sun, Moon, ShieldCheck, Headphones } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTheme } from "next-themes"
import Image from "next/image"

type LoginMode = "select" | "admin" | "operator"

export const LoginForm = memo(function LoginForm() {
  const [mode, setMode] = useState<LoginMode>("select")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { theme, setTheme } = useTheme()
  const { login } = useAuth()

  const resetForm = useCallback(() => {
    setEmail("")
    setPassword("")
    setError("")
    setIsLoading(false)
  }, [])

  const handleModeSelect = useCallback(
    (selected: LoginMode) => {
      resetForm()
      setMode(selected)
    },
    [resetForm],
  )

  const handleBack = useCallback(() => {
    resetForm()
    setMode("select")
  }, [resetForm])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setError("")
      setIsLoading(true)

      try {
        if (!email.trim()) {
          setError("Login obrigatorio")
          setIsLoading(false)
          return
        }

        if (mode === "admin" && !password) {
          setError("Senha obrigatoria para administradores")
          setIsLoading(false)
          return
        }

        const result = await login(email.trim(), mode === "admin" ? password : "")

        if (!result.success) {
          setError(result.error || "Erro ao fazer login")
          setIsLoading(false)
          return
        }

        window.location.href = mode === "admin" ? "/admin" : "/operator"
      } catch {
        setError("Erro ao fazer login")
        setIsLoading(false)
      }
    },
    [email, password, login, mode],
  )

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark")
  }, [theme, setTheme])

  return (
    <Card className="w-full max-w-md mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden">
      {/* Botao tema */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          title="Alternar tema"
          className="h-9 w-9 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>

      <CardContent className="pt-8 pb-8 px-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-xl overflow-hidden ring-2 ring-zinc-100 dark:ring-zinc-800">
            <Image
              src="/images/grupo_roveri_logo.jpg"
              alt="Grupo Roveri"
              width={64}
              height={64}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>

        {/* Titulo */}
        <div className="text-center mb-7">
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
            {mode === "select" && "Bem-vindo"}
            {mode === "admin" && "Acesso Administrativo"}
            {mode === "operator" && "Acesso Operador"}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {mode === "select" && "Selecione o tipo de acesso"}
            {mode === "admin" && "Digite suas credenciais de administrador"}
            {mode === "operator" && "Digite seu login para continuar"}
          </p>
        </div>

        {/* TELA DE SELECAO */}
        {mode === "select" && (
          <div className="flex flex-col gap-3">
            {/* Botao ADM */}
            <button
              onClick={() => handleModeSelect("admin")}
              className="group relative flex items-center gap-4 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 p-4 text-left hover:border-orange-400 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Administrador</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Requer login e senha
                </p>
              </div>
              <div className="shrink-0 text-zinc-300 dark:text-zinc-600 group-hover:text-orange-400 transition-colors">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* Divisor */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
              <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">ou</span>
              <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
            </div>

            {/* Botao Operador */}
            <button
              onClick={() => handleModeSelect("operator")}
              className="group relative flex items-center gap-4 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 p-4 text-left hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 group-hover:bg-zinc-300 dark:group-hover:bg-zinc-600 transition-colors">
                <Headphones className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Operador</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Apenas login, sem senha
                </p>
              </div>
              <div className="shrink-0 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
        )}

        {/* TELA DE FORMULARIO (ADM ou Operador) */}
        {(mode === "admin" || mode === "operator") && (
          <>
            {/* Badge do modo */}
            <div className="flex justify-center mb-5">
              <div
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                  mode === "admin"
                    ? "bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                }`}
              >
                {mode === "admin" ? (
                  <ShieldCheck className="h-3.5 w-3.5" />
                ) : (
                  <Headphones className="h-3.5 w-3.5" />
                )}
                {mode === "admin" ? "Administrador" : "Operador"}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="sr-only">
                  Login
                </label>
                <div className="relative flex items-stretch">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 z-10" />
                  <Input
                    id="email"
                    type="text"
                    placeholder="Login"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value.split("@")[0])
                      setError("")
                    }}
                    required
                    autoComplete="username"
                    autoFocus
                    disabled={isLoading}
                    className="h-12 pl-10 pr-4 flex-1 min-w-0 text-sm bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 rounded-r-none border-r-0"
                  />
                  <div className="h-12 px-3 flex items-center bg-zinc-100 dark:bg-zinc-800 border border-l-0 border-zinc-200 dark:border-zinc-700 rounded-r-md shrink-0">
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 whitespace-nowrap">@gruporoveri.com</span>
                  </div>
                </div>
              </div>

              {/* Senha — apenas admin */}
              {mode === "admin" && (
                <div className="space-y-1.5">
                  <label htmlFor="password" className="sr-only">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Senha"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        setError("")
                      }}
                      required
                      autoComplete="current-password"
                      disabled={isLoading}
                      className="h-12 pl-10 text-sm bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30"
                    />
                  </div>
                </div>
              )}

              {/* Erro */}
              {error && (
                <Alert
                  variant="destructive"
                  className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 py-2"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              {/* Botoes de acao */}
              <div className="flex gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isLoading}
                  className="h-12 px-4 text-sm border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Voltar
                </Button>

                <Button
                  type="submit"
                  className={`flex-1 h-12 text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md ${
                    mode === "admin"
                      ? "bg-orange-600 hover:bg-orange-700 text-white"
                      : "bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 text-white"
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Entrando...
                    </span>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </CardContent>
    </Card>
  )
})
