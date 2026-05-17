"use client"

import { useState, useMemo, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Cloud, Search, X, ArrowLeft } from "lucide-react"
import { useWordCloud } from "@/hooks/use-supabase-admin"

interface OperatorWordCloudModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OperatorWordCloudModal({ open, onOpenChange }: OperatorWordCloudModalProps) {
  const { data: words, loading } = useWordCloud()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedWord, setSelectedWord] = useState<{ word: string; description: string } | null>(null)

  const activeWords = useMemo(() => 
    (words || []).filter((w: any) => w.is_active !== false),
    [words]
  )

  const filteredWords = useMemo(() => {
    if (!searchTerm) return activeWords
    const term = searchTerm.toLowerCase()
    return activeWords.filter((w: any) => 
      w.word.toLowerCase().includes(term)
    )
  }, [activeWords, searchTerm])

  const handleWordClick = useCallback((word: any) => {
    setSelectedWord({ word: word.word, description: word.description || "Sem descricao disponivel." })
  }, [])

  const handleBackToCloud = useCallback(() => {
    setSelectedWord(null)
  }, [])

  const handleClose = useCallback(() => {
    setSelectedWord(null)
    setSearchTerm("")
    onOpenChange(false)
  }, [onOpenChange])

  // Generate random but consistent sizes and positions for words
  const getWordStyle = useCallback((word: string, index: number) => {
    const sizes = ["text-sm", "text-base", "text-lg", "text-xl", "text-2xl"]
    const colors = [
      "text-primary",
      "text-blue-500 dark:text-blue-400",
      "text-green-500 dark:text-green-400",
      "text-purple-500 dark:text-purple-400",
      "text-amber-500 dark:text-amber-400",
      "text-rose-500 dark:text-rose-400",
      "text-cyan-500 dark:text-cyan-400",
      "text-indigo-500 dark:text-indigo-400",
    ]
    
    // Use word length and index for pseudo-random but consistent selection
    const sizeIndex = (word.length + index) % sizes.length
    const colorIndex = (word.charCodeAt(0) + index) % colors.length
    
    return {
      size: sizes[sizeIndex],
      color: colors[colorIndex]
    }
  }, [])

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <Cloud className="h-4 w-4 text-primary" />
            </div>
            Nuvem de Palavras
          </DialogTitle>
        </DialogHeader>

        {selectedWord ? (
          // Detail View
          <div className="flex-1 overflow-auto space-y-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToCloud}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para a nuvem
            </Button>
            
            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                      <span className="text-2xl font-bold text-primary">
                        {selectedWord.word.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {selectedWord.word}
                    </h3>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Descricao</h4>
                    <p className="text-base text-foreground whitespace-pre-wrap leading-relaxed">
                      {selectedWord.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Cloud View
          <div className="flex-1 overflow-hidden flex flex-col space-y-4">
            {/* Search */}
            <div className="relative flex-shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar palavras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Word Cloud */}
            <div className="flex-1 overflow-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-48 gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full border-4 border-muted" />
                    <div className="absolute inset-0 w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                  </div>
                  <p className="text-sm text-muted-foreground">Carregando palavras...</p>
                </div>
              ) : filteredWords.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-muted mb-3">
                    <Cloud className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {searchTerm ? `Nenhuma palavra encontrada para "${searchTerm}"` : "Nenhuma palavra disponivel"}
                  </p>
                </div>
              ) : (
                <Card className="border-dashed bg-gradient-to-br from-muted/30 to-muted/10">
                  <CardContent className="p-6">
                    <div className="flex flex-wrap items-center justify-center gap-3 min-h-[200px]">
                      {filteredWords.map((word: any, index: number) => {
                        const style = getWordStyle(word.word, index)
                        return (
                          <button
                            key={word.id}
                            onClick={() => handleWordClick(word)}
                            className={`
                              ${style.size} ${style.color}
                              font-semibold px-3 py-1.5 rounded-lg
                              transition-all duration-200
                              hover:scale-110 hover:bg-primary/10
                              focus:outline-none focus:ring-2 focus:ring-primary/50
                              cursor-pointer
                            `}
                          >
                            {word.word}
                          </button>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Info */}
            {!loading && filteredWords.length > 0 && (
              <p className="text-xs text-center text-muted-foreground flex-shrink-0">
                Clique em uma palavra para ver sua descricao
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
