"use client"

import type React from "react"
import { useState, useCallback, memo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { AlertCircle, Mail, Lock, Sun, Moon, Eye, EyeOff } from "lucide-react"
import { useTheme } from "next-themes"

export const LoginForm = memo(function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { theme, setTheme } = useTheme()
  const { login } = useAuth()

  const isAdminUser = useCallback((inputEmail: string) => {
    const adminPatterns = ["admin", "monitoria", "supervisor", "qualidade"]
    return adminPatterns.some((p) => inputEmail.toLowerCase().includes(p))
  }, [])

  const showPasswordField = isAdminUser(email)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setError("")
      setIsLoading(true)

      try {
        if (!email.trim()) {
          setError("Informe o login.")
          setIsLoading(false)
          return
        }
        if (showPasswordField && !password) {
          setError("Senha obrigatória para administradores.")
          setIsLoading(false)
          return
        }

        const result = await login(email.trim(), showPasswordField ? password : "")

        if (!result.success) {
          setError(result.error || "Credenciais inválidas.")
          setIsLoading(false)
          return
        }

        window.location.href = isAdminUser(email.trim()) ? "/admin" : "/operator"
      } catch {
        setError("Erro ao fazer login. Tente novamente.")
        setIsLoading(false)
      }
    },
    [email, password, login, showPasswordField, isAdminUser],
  )

  return (
    <div className="relative">
      {/* Botão de tema — canto superior direito */}
      <button
        type="button"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="absolute -top-12 right-0 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        title="Alternar tema"
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Campo login */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Login
          </label>
          <div className="flex">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="email"
                type="text"
                placeholder="seu.nome"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value.split("@")[0])
                  setError("")
                }}
                required
                autoComplete="username"
                disabled={isLoading}
                className="pl-9 h-11 rounded-r-none border-r-0 text-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
              />
            </div>
            <div className="h-11 px-3 flex items-center border border-l-0 border-input bg-muted rounded-r-md shrink-0">
              <span className="text-xs text-muted-foreground select-none whitespace-nowrap">
                @gruporoveri.com
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Use o mesmo login do CRM.</p>
        </div>

        {/* Campo senha — somente admins */}
        {showPasswordField && (
          <div className="flex flex-col gap-1.5 animate-fade-in">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={isLoading}
                className="pl-9 pr-10 h-11 text-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}

        {/* Mensagem de erro */}
        {error && (
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Botão entrar */}
        <Button
          type="submit"
          className="h-11 w-full font-semibold text-sm bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all duration-150 mt-1"
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
      </form>
    </div>
  )
})
