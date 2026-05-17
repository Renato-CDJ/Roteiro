"use client"

import type React from "react"
import { useState, useCallback, memo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { AlertCircle, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react"
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
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Campo de Email */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-zinc-300">
          Login
        </label>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            <Mail className="h-5 w-5 text-zinc-600 group-focus-within:text-orange-500 transition-colors duration-300" />
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
            className="h-14 pl-12 pr-[140px] text-base rounded-2xl bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-zinc-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:bg-zinc-800 transition-all duration-300"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <span className="text-sm text-zinc-600">@gruporoveri.com</span>
          </div>
        </div>
        <p className="text-xs text-zinc-600 pl-1">Digite o login do CRM</p>
      </div>

      {/* Campo de Senha */}
      {showPasswordField && (
        <div className="space-y-2 animate-fade-in">
          <label htmlFor="password" className="text-sm font-medium text-zinc-300">
            Senha
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <Lock className="h-5 w-5 text-zinc-600 group-focus-within:text-orange-500 transition-colors duration-300" />
            </div>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={isLoading}
              className="h-14 pl-12 pr-12 text-base rounded-2xl bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-zinc-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:bg-zinc-800 transition-all duration-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
      )}

      {/* Mensagem de Erro */}
      {error && (
        <Alert className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl animate-fade-in">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}

      {/* Botão de Submit */}
      <Button
        type="submit"
        disabled={isLoading}
        className="relative w-full h-14 text-base font-semibold rounded-2xl bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-300 group overflow-hidden"
      >
        {/* Efeito de brilho */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        
        {isLoading ? (
          <span className="flex items-center gap-3">
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
