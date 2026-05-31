"use client"

import { useBlockchain } from '@/lib/contexto-cadena-bloques'
import { Badge } from '@/components/ui/insignia'
import { Boxes, ShieldCheck, ShieldAlert, Network, Wifi } from 'lucide-react'
import { cn } from '@/lib/utilidades'

export function Header() {
  const { chain, isChainValid, pendingTransactions, nodes, syncedNodeCount, networkStatus } = useBlockchain()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Boxes className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Block<span className="text-primary">Lab</span>
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Simulador Educativo · Red Descentralizada
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            {/* Block count */}
            <Badge variant="secondary" className="font-mono">
              {chain.length} bloques
            </Badge>

            {/* Network status */}
            {nodes.length > 0 && (
              <Badge
                variant="outline"
                className={cn(
                  'font-mono gap-1',
                  networkStatus === 'healthy'  ? 'text-success border-success/30'    :
                  networkStatus === 'degraded' ? 'text-warning border-warning/30'    :
                                                  'text-destructive border-destructive/30'
                )}
              >
                <Network className="h-3 w-3" />
                {syncedNodeCount}/{nodes.length} nodos
              </Badge>
            )}

            {/* Pending transactions */}
            {pendingTransactions.length > 0 && (
              <Badge variant="outline" className="text-warning border-warning/30">
                {pendingTransactions.length} pendientes
              </Badge>
            )}
          </div>

          {/* Chain integrity */}
          {isChainValid ? (
            <Badge className="bg-success/20 text-success border-success/30">
              <ShieldCheck className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Integra</span>
            </Badge>
          ) : (
            <Badge variant="destructive" className="animate-pulse">
              <ShieldAlert className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Comprometida</span>
            </Badge>
          )}
        </div>
      </div>
    </header>
  )
}
