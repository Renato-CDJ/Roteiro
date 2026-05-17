"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { LoginForm } from "@/components/login-form"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/operator")
      }
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let mouseX = canvas.width / 2
    let mouseY = canvas.height / 2

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    window.addEventListener("mousemove", handleMouseMove)

    // Partículas menores para conectar com linhas
    const PARTICLE_COUNT = 50
    const particles: {
      x: number
      y: number
      radius: number
      vx: number
      vy: number
      alpha: number
      originalX: number
      originalY: number
    }[] = []

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      particles.push({
        x,
        y,
        originalX: x,
        originalY: y,
        radius: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.4 + 0.3,
      })
    }

    const draw = () => {
      // Limpar com cor muito escura
      ctx.fillStyle = "rgba(2, 2, 5, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Atualizar partículas
      for (const p of particles) {
        // Movimento suave em torno da posição original
        p.x += p.vx
        p.y += p.vy

        // Volta à posição original suavemente
        const dx = p.originalX - p.x
        const dy = p.originalY - p.y
        p.vx += dx * 0.0002
        p.vy += dy * 0.0002

        p.vx *= 0.98
        p.vy *= 0.98

        // Wrap around
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        // Desenhar partícula com glow laranja
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4)
        gradient.addColorStop(0, `rgba(249, 115, 22, ${p.alpha * 0.8})`)
        gradient.addColorStop(1, "rgba(249, 115, 22, 0)")
        ctx.fillStyle = gradient
        ctx.fill()

        // Centro mais brilhante
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius * 0.4, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.9})`
        ctx.fill()
      }

      // Linhas conectando partículas próximas
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const maxDist = 150

          if (dist < maxDist) {
            const opacity = 0.3 * (1 - dist / maxDist)
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)

            // Gradiente na linha
            const gradient = ctx.createLinearGradient(
              particles[i].x,
              particles[i].y,
              particles[j].x,
              particles[j].y,
            )
            gradient.addColorStop(0, `rgba(249, 115, 22, ${opacity})`)
            gradient.addColorStop(0.5, `rgba(249, 115, 22, ${opacity * 0.7})`)
            gradient.addColorStop(1, `rgba(249, 115, 22, ${opacity})`)

            ctx.strokeStyle = gradient
            ctx.lineWidth = 1.2
            ctx.stroke()

            // Glow nas linhas
            ctx.strokeStyle = `rgba(249, 115, 22, ${opacity * 0.3})`
            ctx.lineWidth = 4
            ctx.stroke()
          }
        }
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="h-8 w-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (user) return null

  return (
    <main className="relative min-h-screen min-h-dvh flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* Canvas com partículas e linhas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Conteúdo centralizado */}
      <div className="relative z-10 w-full max-w-md px-6">
        {/* Branding */}
        <div className="text-center mb-16">
          <h1 className="text-7xl font-black text-orange-500 tracking-tight mb-2 drop-shadow-2xl">
            Roteiro
          </h1>
          <p className="text-zinc-400 text-sm tracking-widest uppercase font-medium">
            Sistema de Atendimento
          </p>
        </div>

        {/* Card do formulário com efeito glass */}
        <div className="relative">
          {/* Glow background */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/10 to-transparent rounded-2xl blur-xl" />

          {/* Card */}
          <div className="relative bg-zinc-950/70 backdrop-blur-2xl border border-orange-500/20 rounded-2xl p-8 shadow-2xl">
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  )
}
