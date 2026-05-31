"use client"

import { useBlockchain } from '@/lib/contexto-cadena-bloques'
import { BlockCard } from './tarjeta-bloque'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/tarjeta'
import { Button } from '@/components/ui/boton'
import { Badge } from '@/components/ui/insignia'
import { RotateCcw, Link2, ShieldCheck, ShieldAlert, ArrowRight, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utilidades'

const NODE_STATUS_DOT: Record<string, string> = {
  synced:     'bg-success',
  validating: 'bg-warning animate-pulse',
  syncing:    'bg-chart-2 animate-pulse',
  altered:    'bg-destructive animate-pulse',
}

export function ChainVisualization() {
  const {
    chain,
    resetChain,
    isChainValid,
    highlightedBlockIndex,
    blockEditState,
    nodes,
    selectedNodeId,
    selectNode,
    propagationPhase,
  } = useBlockchain()

  if (chain.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="p-3 rounded-full bg-primary/10 animate-pulse">
              <Link2 className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Inicializando blockchain...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const validBlocks = chain.filter(b => b.isValid).length
  const integrityPercentage = Math.round((validBlocks / chain.length) * 100)
  const selectedNode = nodes.find(n => n.id === selectedNodeId)
  const isLocked = propagationPhase !== 'idle'

  return (
    <Card className="bg-card border-border overflow-hidden">
      <CardHeader className="pb-4 px-3 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'p-2 rounded-lg transition-colors',
              isChainValid ? 'bg-success/10' : 'bg-destructive/10'
            )}>
              <Link2 className={cn(
                'h-5 w-5 transition-colors',
                isChainValid ? 'text-success' : 'text-destructive'
              )} />
            </div>
            <div>
              <CardTitle className="text-lg">Cadena de Bloques</CardTitle>
              <CardDescription>
                {chain.length} bloque{chain.length > 1 ? 's' : ''} — vista: {selectedNode?.name ?? '—'}
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
            {isChainValid ? (
              <Badge className="bg-success/20 text-success border-success/30">
                <ShieldCheck className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Cadena </span>Integra
              </Badge>
            ) : (
              <Badge variant="destructive" className="animate-pulse">
                <ShieldAlert className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Integridad </span>Comprometida
              </Badge>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={resetChain}
              disabled={isLocked}
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reiniciar
            </Button>
          </div>
        </div>

        {/* Node selector tabs */}
        {nodes.length > 0 && (
          <div className="flex flex-wrap gap-1 p-0.5 rounded-lg bg-secondary/30 w-full sm:w-fit mt-2">
            {nodes.map(node => (
              <button
                key={node.id}
                onClick={() => !isLocked && selectNode(node.id)}
                disabled={isLocked}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150',
                  node.id === selectedNodeId
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                <div className={cn(
                  'w-1.5 h-1.5 rounded-full shrink-0',
                  NODE_STATUS_DOT[node.status] ?? 'bg-muted-foreground'
                )} />
                {node.name.replace('Nodo ', '')}
              </button>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4 px-3 sm:px-6">
        {/* Chain visualization — native overflow-x so blocks scroll horizontally on mobile */}
        <div className="w-full overflow-x-auto">
          <div className="flex items-center gap-0 pb-3 px-1 w-max">
            {chain.map((block, index) => (
              <div key={block.index} className="flex items-center">
                <BlockCard
                  block={block}
                  isFirst={index === 0}
                  isHighlighted={highlightedBlockIndex === block.index}
                />

                {index < chain.length - 1 && (
                  <div className="flex items-center mx-1 min-w-[40px]">
                    <div className="relative flex items-center">
                      <div className={cn(
                        'w-6 h-1 rounded transition-all duration-500',
                        chain[index + 1]?.isValid
                          ? 'bg-gradient-to-r from-success/70 to-success/30'
                          : 'bg-gradient-to-r from-destructive/70 to-destructive/30'
                      )} />
                      <div className={cn(
                        'relative -ml-1',
                        chain[index + 1]?.isValid ? 'text-success' : 'text-destructive animate-pulse'
                      )}>
                        <ArrowRight className="h-6 w-6" />
                        {chain[index + 1]?.isValid && (
                          <div className="absolute inset-0 blur-sm">
                            <ArrowRight className="h-6 w-6 text-success/50" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Integrity bar */}
        <div className={cn(
          'flex flex-col gap-3 py-4 px-4 rounded-lg border transition-all duration-500',
          isChainValid ? 'bg-success/5 border-success/20' : 'bg-destructive/5 border-destructive/20'
        )}>
          <div className="flex items-center justify-center gap-1">
            {chain.map((block, index) => (
              <div key={index} className="flex items-center">
                <div className={cn(
                  'w-4 h-4 rounded-full transition-all duration-500 flex items-center justify-center',
                  block.isValid
                    ? 'bg-success shadow-sm shadow-success/50'
                    : 'bg-destructive animate-pulse shadow-sm shadow-destructive/50'
                )}>
                  {block.isValid ? (
                    <ShieldCheck className="h-2.5 w-2.5 text-success-foreground" />
                  ) : (
                    <AlertTriangle className="h-2.5 w-2.5 text-destructive-foreground" />
                  )}
                </div>
                {index < chain.length - 1 && (
                  <div className={cn(
                    'w-6 h-0.5 transition-all duration-500',
                    chain[index + 1]?.isValid ? 'bg-success/50' : 'bg-destructive/50'
                  )} />
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <span className={cn(
              'text-sm font-medium',
              isChainValid ? 'text-success' : 'text-destructive'
            )}>
              {isChainValid
                ? 'Todos los bloques estan correctamente enlazados'
                : 'Se detecto una alteracion en este nodo'
              }
            </span>
            <Badge variant="outline" className={cn(
              'font-mono',
              isChainValid ? 'text-success border-success/30' : 'text-destructive border-destructive/30'
            )}>
              Integridad: {integrityPercentage}%
            </Badge>
          </div>

          {blockEditState && !blockEditState.isEditing && !isChainValid && (
            <div className="mt-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <p className="font-medium text-destructive">
                    Bloque #{blockEditState.blockIndex} fue alterado en este nodo
                  </p>
                  <p className="text-muted-foreground">
                    Los otros nodos de la red mantienen la version correcta y rechazan esta cadena.
                  </p>
                  <div className="mt-2 space-y-1">
                    <p className="text-muted-foreground">
                      <span className="text-foreground">Hash original:</span>{' '}
                      <code className="text-[10px] line-through">{blockEditState.originalHash.slice(0, 20)}...</code>
                    </p>
                    <p className="text-muted-foreground">
                      <span className="text-destructive">Hash actual:</span>{' '}
                      <code className="text-[10px] text-destructive">{blockEditState.newHash.slice(0, 20)}...</code>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
