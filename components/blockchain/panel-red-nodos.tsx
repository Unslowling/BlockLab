"use client"

import { useBlockchain, type VirtualNode, type NodeId, type PropagationPhase } from '@/lib/contexto-cadena-bloques'
import { NetworkGraph } from './grafico-red'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/tarjeta'
import { Badge } from '@/components/ui/insignia'
import { Button } from '@/components/ui/boton'
import {
  Network,
  ShieldCheck,
  ShieldAlert,
  RefreshCw,
  CheckCircle,
  XCircle,
  Users,
  Wifi,
  WifiOff,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utilidades'

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<VirtualNode['status'], {
  label: string
  dot: string
  text: string
}> = {
  synced:     { label: 'Sincronizado',     dot: 'bg-success',                   text: 'text-success'    },
  validating: { label: 'Validando...',     dot: 'bg-warning animate-pulse',     text: 'text-warning'    },
  syncing:    { label: 'Sincronizando...', dot: 'bg-chart-2 animate-pulse',     text: 'text-chart-2'    },
  altered:    { label: 'Cadena Alterada',  dot: 'bg-destructive animate-pulse', text: 'text-destructive' },
}

// ─── Phase banner ─────────────────────────────────────────────────────────────

const PHASE_BANNER: Partial<Record<PropagationPhase, { label: string; detail: string; classes: string }>> = {
  propagating: {
    label:   'Propagando transacción a la red',
    detail:  'Todos los nodos reciben la solicitud de forma simultánea',
    classes: 'bg-chart-2/10 border-chart-2/25 text-chart-2',
  },
  validating: {
    label:   'Nodos verificando el bloque',
    detail:  'Cada nodo valida de forma independiente — sin autoridad central',
    classes: 'bg-warning/10 border-warning/25 text-warning',
  },
  consensus: {
    label:   'Consenso alcanzado',
    detail:  'La mayoría de nodos aprobó el bloque — el protocolo acepta el registro',
    classes: 'bg-success/10 border-success/25 text-success',
  },
  syncing: {
    label:   'Replicando en toda la red',
    detail:  'El bloque se copia en los 4 nodos manteniendo la cadena sincronizada',
    classes: 'bg-chart-2/10 border-chart-2/25 text-chart-2',
  },
}

// ─── Node status card ─────────────────────────────────────────────────────────

function NodeStatusCard({
  node,
  isSelected,
  onSelect,
  onSync,
  isPropagating,
}: {
  node: VirtualNode
  isSelected: boolean
  onSelect: (id: NodeId) => void
  onSync: (id: NodeId) => void
  isPropagating: boolean
}) {
  const cfg    = STATUS_CONFIG[node.status]
  const isAlt  = node.status === 'altered'

  return (
    <div
      className={cn(
        'rounded-xl border-2 p-3 space-y-2.5 transition-all duration-300 cursor-pointer',
        isSelected
          ? isAlt
            ? 'border-destructive/60 bg-destructive/5 shadow-sm'
            : 'border-primary/50 bg-primary/5 shadow-sm'
          : isAlt
            ? 'border-destructive/25 bg-destructive/5 hover:border-destructive/40'
            : 'border-border bg-card hover:border-border/60',
      )}
      onClick={() => !isPropagating && onSelect(node.id)}
      role="button"
      tabIndex={0}
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn('w-2 h-2 rounded-full shrink-0', cfg.dot)} />
          <span className={cn(
            'text-xs font-semibold',
            isSelected ? 'text-foreground' : 'text-muted-foreground',
          )}>
            {node.name}
          </span>
        </div>

        {/* Vote / spinner indicators */}
        {node.vote === 'approved' && <CheckCircle className="h-3.5 w-3.5 text-success shrink-0" />}
        {node.vote === 'rejected' && <XCircle     className="h-3.5 w-3.5 text-destructive shrink-0" />}
        {isPropagating && node.vote === null && node.status === 'validating' && (
          <div className="h-3 w-3 rounded-full border-2 border-warning border-t-transparent animate-spin" />
        )}
      </div>

      {/* Status label */}
      <div className={cn('text-[10px] font-medium', cfg.text)}>{cfg.label}</div>

      {/* Chain info row */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground font-mono">
          {node.chain.length} bloque{node.chain.length !== 1 ? 's' : ''}
        </span>
        {isSelected && (
          <Badge variant="outline" className="text-[9px] h-4 px-1.5 border-primary/40 text-primary">
            vista activa
          </Badge>
        )}
      </div>

      {/* Mini block row */}
      <div className="flex gap-0.5">
        {node.chain.slice(0, 6).map((block, i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 rounded-sm flex-1 transition-colors duration-300',
              block.isValid ? 'bg-success/60' : 'bg-destructive/60 animate-pulse',
            )}
          />
        ))}
      </div>

      {/* Resync button for altered nodes */}
      {isAlt && (
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => { e.stopPropagation(); onSync(node.id) }}
          className="w-full h-6 text-[10px] border-destructive/30 text-destructive hover:bg-destructive/10"
        >
          <RefreshCw className="h-2.5 w-2.5 mr-1.5" />
          Resincronizar nodo
        </Button>
      )}
    </div>
  )
}

// ─── Main panel ───────────────────────────────────────────────────────────────

export function NodeNetworkPanel() {
  const {
    nodes,
    selectedNodeId,
    selectNode,
    syncNode,
    propagationPhase,
    consensusResult,
    networkStatus,
    syncedNodeCount,
  } = useBlockchain()

  if (nodes.length === 0) return null

  const banner       = PHASE_BANNER[propagationPhase]
  const isPropagating = propagationPhase !== 'idle'
  const alteredCount = nodes.filter(n => n.status === 'altered').length

  return (
    <Card className="bg-card border-border overflow-hidden">
      <CardHeader className="pb-3 px-3 sm:px-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              'p-2 rounded-lg transition-colors',
              networkStatus === 'healthy'  ? 'bg-success/10'     :
              networkStatus === 'degraded' ? 'bg-warning/10'     : 'bg-destructive/10',
            )}>
              <Network className={cn(
                'h-5 w-5',
                networkStatus === 'healthy'  ? 'text-success'     :
                networkStatus === 'degraded' ? 'text-warning'     : 'text-destructive',
              )} />
            </div>
            <div>
              <CardTitle className="text-lg">Red Blockchain Distribuida</CardTitle>
              <CardDescription>
                {nodes.length} nodos virtuales · arquitectura descentralizada
              </CardDescription>
            </div>
          </div>

          {/* Network health badge */}
          {networkStatus === 'healthy' ? (
            <Badge className="bg-success/15 text-success border-success/30">
              <Wifi className="h-3 w-3 mr-1" />
              {syncedNodeCount}/{nodes.length} sincronizados
            </Badge>
          ) : alteredCount > 0 ? (
            <Badge variant="destructive" className="animate-pulse">
              <WifiOff className="h-3 w-3 mr-1" />
              {alteredCount} nodo{alteredCount > 1 ? 's' : ''} alterado{alteredCount > 1 ? 's' : ''}
            </Badge>
          ) : (
            <Badge variant="outline" className="border-warning/30 text-warning">
              <ShieldAlert className="h-3 w-3 mr-1" />
              Red degradada
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-3 sm:px-6">
        {/* SVG Network Graph */}
        <div className="rounded-xl bg-secondary/20 border border-border py-3">
          <NetworkGraph />
        </div>

        {/* Phase banner — grid trick keeps content in DOM so height animates smoothly */}
        <div className={cn(
          'grid transition-[grid-template-rows] duration-500 ease-in-out',
          banner ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}>
          <div className="overflow-hidden">
            <div className={cn(
              'rounded-lg border px-3 py-2.5 space-y-1',
              banner ? banner.classes : 'opacity-0 border-transparent',
            )}>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin shrink-0" />
                <span className="text-xs font-semibold">{banner?.label ?? ''}</span>
              </div>
              <p className="text-[11px] opacity-80 pl-5">{banner?.detail ?? ''}</p>
            </div>
          </div>
        </div>

        {/* Consensus result — same grid trick */}
        <div className={cn(
          'grid transition-[grid-template-rows] duration-500 ease-in-out',
          consensusResult ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}>
          <div className="overflow-hidden">
            <div className={cn(
              'flex items-center justify-between px-3 py-2.5 rounded-lg border',
              consensusResult ? 'bg-success/10 border-success/25' : 'opacity-0 border-transparent',
            )}>
              <div className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-success" />
                <span className="text-xs font-semibold text-success">Consenso de red</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-success font-bold">
                  {consensusResult?.approved ?? 0}/{consensusResult?.total ?? 0} aprobaron
                </span>
                <Badge className="bg-success/20 text-success border-success/30 text-[10px] h-5">
                  <CheckCircle className="h-2.5 w-2.5 mr-1" />
                  Aceptado
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Node status cards grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {nodes.map(node => (
            <NodeStatusCard
              key={node.id}
              node={node}
              isSelected={node.id === selectedNodeId}
              onSelect={selectNode}
              onSync={syncNode}
              isPropagating={isPropagating}
            />
          ))}
        </div>

        {/* Educational footer */}
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-secondary/30 border border-border">
          <Info className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            <span className="text-foreground font-medium">Haz clic en un nodo</span> para ver
            su cadena local. Ningún nodo tiene autoridad central — todos son iguales en la red.
            Cuando un nodo se altera, los demás mantienen la versión correcta.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
