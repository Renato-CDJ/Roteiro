"use client"

import { useState, useMemo, useCallback, memo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useCachedChannels } from "@/hooks/use-cached-data"
import { Search, X, ChevronRight, Radio } from "lucide-react"

interface OperatorChannelsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface ChannelData {
  id: string
  name: string
  description?: string
  contact?: string
}

// Modal de detalhe
const DetailModal = memo(function DetailModal({
  open,
  onClose,
  channel,
}: {
  open: boolean
  onClose: () => void
  channel: ChannelData | null
}) {
  if (!open || !channel) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden border-border/50">
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-4">
          <DialogHeader>
            <DialogTitle className="text-white text-lg font-semibold flex items-center justify-center gap-2 text-center">
              <Radio className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{channel.name}</span>
            </DialogTitle>
          </DialogHeader>
        </div>
        
        <div className="p-4 space-y-3">
          {channel.description && (
            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-1">Descricao</h4>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {channel.description}
              </p>
            </div>
          )}
          {channel.contact && (
            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-1">Contato</h4>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {channel.contact}
              </p>
            </div>
          )}
          {!channel.description && !channel.contact && (
            <p className="text-sm text-muted-foreground italic">
              Sem informacoes adicionais disponiveis
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
})

export const OperatorChannelsModal = memo(function OperatorChannelsModal({
  open,
  onOpenChange,
}: OperatorChannelsModalProps) {
  const [search, setSearch] = useState("")
  const [selectedChannel, setSelectedChannel] = useState<ChannelData | null>(null)
  const [showDetail, setShowDetail] = useState(false)

  const { channels: channelsRaw } = useCachedChannels()

  const channels = useMemo<ChannelData[]>(() => 
    channelsRaw
      .filter((c: any) => c.is_active !== false)
      .map((c: any) => ({
        id: c.id,
        name: c.name,
        description: c.description || "",
        contact: c.icon || "",
      }))
  , [channelsRaw])

  const filteredChannels = useMemo(() => {
    if (!search.trim()) return channels
    const query = search.toLowerCase()
    return channels.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.contact?.toLowerCase().includes(query)
    )
  }, [channels, search])

  const handleSelectChannel = useCallback((channel: ChannelData) => {
    setSelectedChannel(channel)
    setShowDetail(true)
  }, [])

  const handleCloseDetail = useCallback(() => {
    setShowDetail(false)
    setSelectedChannel(null)
  }, [])

  const handleClose = useCallback(() => {
    onOpenChange(false)
    setSearch("")
    setSelectedChannel(null)
    setShowDetail(false)
  }, [onOpenChange])

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-lg w-[90vw] max-h-[80vh] p-0 gap-0 flex flex-col border-border/50">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-4 flex-shrink-0">
            <DialogHeader>
              <DialogTitle className="text-white text-lg font-semibold flex items-center gap-2">
                <Radio className="h-5 w-5" />
                Canais
              </DialogTitle>
            </DialogHeader>
            
            {/* Busca */}
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
              <Input
                placeholder="Buscar canal..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/60 h-9 text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          
          {/* Contador */}
          <div className="px-4 py-2 bg-muted/30 border-b border-border/50 text-xs text-muted-foreground flex-shrink-0 flex items-center justify-between">
            <span>
              {filteredChannels.length === channels.length 
                ? `${channels.length} canais`
                : `${filteredChannels.length} de ${channels.length} canais`
              }
            </span>
            <Badge variant="secondary" className="text-xs">
              {channels.length}
            </Badge>
          </div>
          
          {/* Lista com scroll */}
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-3 space-y-1.5">
              {filteredChannels.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Nenhum canal encontrado
                </div>
              ) : (
                filteredChannels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => handleSelectChannel(channel)}
                    className="w-full text-left p-3 rounded-lg border border-border/50 bg-card hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                        <Radio className="h-4 w-4 text-indigo-500" />
                      </div>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <h4 className="font-medium text-sm text-foreground group-hover:text-indigo-500 transition-colors truncate">
                          {channel.name}
                        </h4>
                        {(channel.description || channel.contact) && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {channel.contact || channel.description}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 group-hover:text-indigo-500 transition-colors" />
                    </div>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Modal de detalhe */}
      <DetailModal
        open={showDetail}
        onClose={handleCloseDetail}
        channel={selectedChannel}
      />
    </>
  )
})
