"use client"

import type React from "react"
import { useState, useCallback, memo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { AlertCircle, Eye, EyeOff, ArrowRight } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export const LoginForm = memo(function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Campo de Login */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-zinc-400">
          Login
        </label>
        <div className="relative">
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
            className="h-12 px-4 pr-36 text-base rounded-xl bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-600">
            @gruporoveri.com
          </span>
        </div>
      </div>

      {/* Campo de Senha (condicional) */}
      {showPasswordField && (
        <div className="space-y-2 animate-fade-in">
          <label htmlFor="password" className="text-sm font-medium text-zinc-400">
            Senha
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={isLoading}
              className="h-12 px-4 pr-12 text-base rounded-xl bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
      )}

      {/* Erro */}
      {error && (
        <Alert className="bg-red-500/10 border-red-500/20 text-red-400 rounded-xl">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Botão */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 text-base font-semibold rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition-all group"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Entrando...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Entrar
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </span>
        )}
      </Button>
    </form>
  )
})
