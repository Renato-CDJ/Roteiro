"use client"

import type React from "react"
import { useState, useCallback, memo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { AlertCircle, Lock, Sun, Moon, Shield, User, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { useTheme } from "next-themes"
import Image from "next/image"

type LoginMode = "select" | "admin"

export const LoginForm = memo(function LoginForm() {
  const [mode, setMode] = useState<LoginMode>("select")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { theme, setTheme } = useTheme()
  const { login } = useAuth()

  const handleAdminLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setError("")
      setIsLoading(true)

      try {
        if (!password) {
          setError("Senha obrigatoria")
          setIsLoading(false)
          return
        }
        
        // Login como admin usando email padrao
        const result = await login("admin@gruporoveri.com", password)
        
        if (!result.success) {
          setError(result.error || "Erro ao fazer login")
          setIsLoading(false)
          return
        }
        
        window.location.href = "/admin"
      } catch (err) {
        setError("Erro ao fazer login")
        setIsLoading(false)
      }
    },
    [password, login],
  )

  const handleOperatorLogin = useCallback(async () => {
    setError("")
    setIsLoading(true)

    try {
      // Login direto como operador usando usuario "operador"
      const result = await login("operador@gruporoveri.com", "")
      
      if (!result.success) {
        setError(result.error || "Erro ao fazer login")
        setIsLoading(false)
        return
      }
      
      window.location.href = "/operator"
    } catch (err) {
      setError("Erro ao fazer login")
      setIsLoading(false)
    }
  }, [login])

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark")
  }, [theme, setTheme])

  const handleBack = useCallback(() => {
    setMode("select")
    setPassword("")
    setError("")
  }, [])

  return (
    <Card className="w-full max-w-md mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
      {/* Botao tema */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          title="Alternar tema"
          className="h-9 w-9 rounded-full text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
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

        {/* Modo de selecao */}
        {mode === "select" && (
          <div className="space-y-4">
            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              Selecione o tipo de acesso
            </p>
            
            {/* Botao ADM */}
            <Button
              onClick={() => setMode("admin")}
              disabled={isLoading}
              className="w-full h-14 text-base font-semibold bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 text-white transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-3"
            >
              <Shield className="h-5 w-5" />
              Administrador
            </Button>

            {/* Botao Operador */}
            <Button
              onClick={handleOperatorLogin}
              disabled={isLoading}
              variant="outline"
              className="w-full h-14 text-base font-semibold border-2 border-orange-500 text-orange-600 hover:bg-orange-50 dark:border-orange-500 dark:text-orange-400 dark:hover:bg-orange-950/30 transition-all duration-200 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Entrando...
                </span>
              ) : (
                <>
                  <User className="h-5 w-5" />
                  Operador
                </>
              )}
            </Button>

            {/* Erro */}
            {error && (
              <Alert
                variant="destructive"
                className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Modo Admin - Campo de senha */}
        {mode === "admin" && (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            {/* Botao voltar */}
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>

            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-3">
                <Shield className="h-6 w-6 text-zinc-600 dark:text-zinc-300" />
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Digite a senha de administrador
              </p>
            </div>

            {/* Senha */}
            <div className="space-y-2">
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
                  autoFocus
                  disabled={isLoading}
                  className="h-12 pl-10 text-sm bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all"
                />
              </div>
            </div>

            {/* Erro */}
            {error && (
              <Alert
                variant="destructive"
                className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            {/* Botao Entrar */}
            <Button
              type="submit"
              className="w-full h-12 text-sm font-semibold bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 text-white transition-all duration-200 shadow-sm hover:shadow-md"
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
        )}
      </CardContent>
    </Card>
  )
})
