"use client"

import { useBlockchain, EXPLANATIONS, type ExplanationType } from '@/lib/contexto-cadena-bloques'
import { Card, CardContent } from '@/components/ui/tarjeta'
import { cn } from '@/lib/utilidades'
import {
  Cpu, ArrowLeftRight, Clock, Hash, Boxes, Link2, ShieldCheck, ShieldAlert,
  Pencil, Network, Loader2, CheckCircle2, RefreshCw,
} from 'lucide-react'

const ICONS: Record<string, React.ElementType> = {
  welcome:    Cpu,
  transaction: ArrowLeftRight,
  pending:    Clock,
  hash:       Hash,
  block:      Boxes,
  chain:      Link2,
  valid:      ShieldCheck,
  invalid:    ShieldAlert,
  altered:    Pencil,
  network:    Network,
  validating: Loader2,
  syncing:    RefreshCw,
}

const COLORS: Record<string, string> = {
  welcome:     'bg-primary/10 text-primary border-primary/20',
  transaction: 'bg-chart-2/10 text-chart-2 border-chart-2/20',
  pending:     'bg-warning/10 text-warning border-warning/20',
  block:       'bg-chart-4/10 text-chart-4 border-chart-4/20',
  hash:        'bg-primary/10 text-primary border-primary/20',
  chain:       'bg-chart-2/10 text-chart-2 border-chart-2/20',
  valid:       'bg-success/10 text-success border-success/20',
  invalid:     'bg-destructive/10 text-destructive border-destructive/20',
  altered:     'bg-destructive/10 text-destructive border-destructive/20',
  network:     'bg-chart-2/10 text-chart-2 border-chart-2/20',
  validating:  'bg-warning/10 text-warning border-warning/20',
  syncing:     'bg-chart-2/10 text-chart-2 border-chart-2/20',
}

export function ExplanationPanel() {
  const { currentExplanation, isAnimating } = useBlockchain()
  const explanation = EXPLANATIONS[currentExplanation]
  const iconKey = explanation.icon
  const colorClass = COLORS[iconKey] ?? COLORS.welcome

  const IconComponent = ICONS[iconKey]

  return (
    <Card className={cn(
      'border-2 transition-all duration-500',
      colorClass,
      isAnimating && 'animate-pulse'
    )}>
      <CardContent className="px-3 py-3 sm:px-5 sm:py-4">
        <div className="flex items-start gap-4">
          {IconComponent && (
            <div className={cn('p-3 rounded-lg border shrink-0', colorClass)}>
              <IconComponent className="h-6 w-6" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-base text-foreground mb-1">
              {explanation.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed min-h-[4.5rem] sm:min-h-0">
              {explanation.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
