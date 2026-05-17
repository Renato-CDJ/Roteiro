"use client"

import type React from "react"
import { useState, useCallback, memo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { AlertCircle, Mail, Lock, Sun, Moon, ArrowRight } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTheme } from "next-themes"
import Image from "next/image"

export const LoginForm = memo(function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { theme, setTheme } = useTheme()
  const { login } = useAuth()

  const isAdminUser = useCallback((inputEmail: string) => {
    const adminPatterns = ["admin", "monitoria", "supervisor", "qualidade"]
    const lowerEmail = inputEmail.toLowerCase()
    return adminPatterns.some((pattern) => lowerEmail.includes(pattern))
  }, [])

  const showPasswordField = isAdminUser(email)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setError("")
      setIsLoading(true)

      try {
        if (!email.trim()) {
          setError("Email é obrigatório")
          setIsLoading(false)
          return
        }

        if (showPasswordField && !password) {
          setError("Senha obrigatória para administradores")
          setIsLoading(false)
          return
        }

        const result = await login(email.trim(), showPasswordField ? password : "")

        if (!result.success) {
          setError(result.error || "Erro ao fazer login")
          setIsLoading(false)
          return
        }

        const isAdmin = isAdminUser(email.trim())
        window.location.href = isAdmin ? "/admin" : "/operator"
      } catch {
        setError("Erro ao fazer login")
        setIsLoading(false)
      }
    },
    [email, password, login, showPasswordField, isAdminUser],
  )

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark")
  }, [theme, setTheme])

  return (
    <div className="relative w-full">
      {/* Botão de tema */}
      <div className="absolute -top-12 right-0 z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          title="Alternar tema"
          className="h-8 w-8 rounded-full text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Card do formulário */}
      <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-8 shadow-2xl">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-zinc-700 shrink-0">
            <Image
              src="/images/grupo_roveri_logo.jpg"
              alt="Grupo Roveri"
              width={40}
              height={40}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-tight">Grupo Roveri</p>
            <p className="text-xs text-zinc-500">Acesse sua conta</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Login
            </label>
            <div className="relative flex items-stretch">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                <Mail className="h-4 w-4 text-zinc-500" />
              </div>
              <Input
                id="email"
                type="text"
                placeholder="seu.login"
                value={email}
                onChange={(e) => {
                  const value = e.target.value.split("@")[0]
                  setEmail(value)
                  setError("")
                }}
                required
                autoComplete="username"
                disabled={isLoading}
                className="h-11 pl-9 pr-2 flex-1 min-w-0 text-sm rounded-r-none border-r-0 bg-zinc-800/80 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all"
              />
              <div className="h-11 px-3 flex items-center bg-zinc-800 border border-l-0 border-zinc-700 rounded-r-lg shrink-0">
                <span className="text-xs text-zinc-500 whitespace-nowrap">@gruporoveri.com</span>
              </div>
            </div>
            <p className="text-xs text-zinc-600">Digite o login do CRM</p>
          </div>

          {/* Senha — apenas para admins */}
          {showPasswordField && (
            <div className="space-y-1.5 animate-fade-in">
              <label htmlFor="password" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 z-10" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                  className="h-11 pl-9 text-sm bg-zinc-800/80 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all"
                />
              </div>
            </div>
          )}

          {/* Erro */}
          {error && (
            <Alert className="bg-red-950/40 border border-red-800/60 text-red-300 py-3">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-sm text-red-300">{error}</AlertDescription>
            </Alert>
          )}

          {/* Botão de entrar */}
          <Button
            type="submit"
            className="w-full h-11 text-sm font-semibold bg-orange-600 hover:bg-orange-500 text-white transition-all duration-200 shadow-lg shadow-orange-900/30 hover:shadow-orange-800/40 rounded-lg flex items-center justify-center gap-2 group mt-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Entrando...
              </span>
            ) : (
              <>
                Entrar
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
})
