"use client"

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/tarjeta'
import { Button } from '@/components/ui/boton'
import {
  Blocks,
  Fingerprint,
  Route,
  ShieldCheck,
  Lock,
  Users,
  ChevronDown,
  ArrowRight,
  CheckCircle,
  XCircle,
  Cpu,
  Coins,
  GraduationCap,
  FlaskConical,
  Package,
  AlertTriangle,
  Clock,
  Server,
  Network,
  Share2,
  Database,
  Wifi,
} from 'lucide-react'
import { cn } from '@/lib/utilidades'

function simpleHash(input: string): string {
  if (!input) return '0'.repeat(16)
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  const h2 = (h ^ 0xdeadbeef) >>> 0
  return (h >>> 0).toString(16).padStart(8, '0') + h2.toString(16).padStart(8, '0')
}

const TOPICS = [
  {
    id: 'blockchain',
    icon: <Blocks className="h-5 w-5" />,
    title: '¿Qué es Blockchain?',
    subtitle: 'La cadena de bloques explicada de forma simple',
    openBorder: 'border-primary/40',
    openBg: 'bg-primary/5',
    iconOpen: 'bg-primary/20 text-primary',
  },
  {
    id: 'hash',
    icon: <Fingerprint className="h-5 w-5" />,
    title: '¿Qué es un Hash?',
    subtitle: 'La huella digital única de los datos',
    openBorder: 'border-chart-2/40',
    openBg: 'bg-chart-2/5',
    iconOpen: 'bg-chart-2/20 text-chart-2',
  },
  {
    id: 'trazabilidad',
    icon: <Route className="h-5 w-5" />,
    title: '¿Qué es la Trazabilidad?',
    subtitle: 'El seguimiento verificable de cada paso',
    openBorder: 'border-warning/40',
    openBg: 'bg-warning/5',
    iconOpen: 'bg-warning/20 text-warning',
  },
  {
    id: 'validacion',
    icon: <ShieldCheck className="h-5 w-5" />,
    title: '¿Cómo funciona la Validación?',
    subtitle: 'El proceso de verificación en la red',
    openBorder: 'border-success/40',
    openBg: 'bg-success/5',
    iconOpen: 'bg-success/20 text-success',
  },
  {
    id: 'inmutabilidad',
    icon: <Lock className="h-5 w-5" />,
    title: '¿Qué es la Inmutabilidad?',
    subtitle: 'Por qué los datos no pueden modificarse fácilmente',
    openBorder: 'border-destructive/40',
    openBg: 'bg-destructive/5',
    iconOpen: 'bg-destructive/20 text-destructive',
  },
  {
    id: 'consenso',
    icon: <Users className="h-5 w-5" />,
    title: 'Mecanismos de Consenso',
    subtitle: 'Cómo la red llega a un acuerdo',
    openBorder: 'border-chart-5/40',
    openBg: 'bg-chart-5/5',
    iconOpen: 'bg-chart-5/20 text-chart-5',
  },
  {
    id: 'nodo',
    icon: <Server className="h-5 w-5" />,
    title: '¿Qué es un Nodo?',
    subtitle: 'El participante fundamental de la red blockchain',
    openBorder: 'border-chart-2/40',
    openBg: 'bg-chart-2/5',
    iconOpen: 'bg-chart-2/20 text-chart-2',
  },
  {
    id: 'descentralizacion',
    icon: <Share2 className="h-5 w-5" />,
    title: 'Descentralización',
    subtitle: 'Por qué no existe un servidor central',
    openBorder: 'border-primary/40',
    openBg: 'bg-primary/5',
    iconOpen: 'bg-primary/20 text-primary',
  },
]

// ─── Topic content components ───────────────────────────────────────────────

function BlockchainContent() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground leading-relaxed">
        Una blockchain es una base de datos distribuida que almacena información en bloques enlazados
        cronológicamente. A diferencia de una base de datos tradicional, los datos están replicados
        entre muchos participantes y nadie puede modificarlos sin que todos lo detecten.
      </p>

      <div className="p-4 rounded-lg bg-secondary/40 border border-border">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Ejemplo visual — cadena de bloques
        </p>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {[
            { label: 'Génesis', note: 'hash: 0000...', isGenesis: true },
            { label: 'Bloque #1', note: 'prev: 0000...', isGenesis: false },
            { label: 'Bloque #2', note: 'prev: a3f9...', isGenesis: false },
          ].map((block, i) => (
            <div key={block.label} className="flex items-center gap-2 shrink-0">
              <div className={cn(
                'rounded-lg border px-3 py-2.5 text-center min-w-[90px] transition-colors',
                block.isGenesis
                  ? 'bg-warning/10 border-warning/30'
                  : 'bg-primary/10 border-primary/30'
              )}>
                <Package className={cn('h-4 w-4 mx-auto mb-1', block.isGenesis ? 'text-warning' : 'text-primary')} />
                <div className={cn('text-xs font-semibold', block.isGenesis ? 'text-warning' : 'text-primary')}>
                  {block.label}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">{block.note}</div>
              </div>
              {i < 2 && <ArrowRight className="h-4 w-4 text-primary shrink-0" />}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3 italic">
          Cada bloque contiene el hash del anterior, formando una cadena donde alterar un bloque invalida todos los siguientes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: <Blocks className="h-4 w-4" />, title: 'Distribuida', desc: 'Múltiples copias en toda la red' },
          { icon: <ShieldCheck className="h-4 w-4" />, title: 'Transparente', desc: 'Cualquiera puede verificar los datos' },
          { icon: <Lock className="h-4 w-4" />, title: 'Descentralizada', desc: 'Sin autoridad central de control' },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="p-3 rounded-lg bg-primary/5 border border-primary/15 text-center">
            <div className="flex justify-center mb-1.5 text-primary">{icon}</div>
            <div className="text-xs font-semibold text-foreground">{title}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">{desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function HashContent() {
  const [hashInput, setHashInput] = useState('Hola')
  const hashA = simpleHash('Hola')
  const hashB = simpleHash('Hola1')
  const currentHash = simpleHash(hashInput)

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground leading-relaxed">
        Un hash es el resultado de una función matemática que convierte cualquier dato en una
        cadena de caracteres única y de longitud fija. Es la &quot;huella digital&quot; de la información:
        el mismo dato siempre produce el mismo hash, pero cualquier cambio —por mínimo que sea—
        genera un resultado completamente diferente.
      </p>

      <div className="p-4 rounded-lg bg-secondary/40 border border-border space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Demo interactivo — escribe para ver el hash cambiar
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-12 shrink-0">Texto:</span>
            <input
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              className="flex-1 px-3 py-1.5 text-sm font-mono bg-input border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
              placeholder="Escribe aquí..."
            />
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xs text-muted-foreground w-12 shrink-0 pt-1.5">Hash:</span>
            <div className="flex-1 px-3 py-1.5 text-sm font-mono bg-background border border-chart-2/40 rounded-md text-chart-2 break-all">
              {currentHash}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-secondary/40 border border-border space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Comparación — un solo carácter cambia todo el hash
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <div className="text-xs text-muted-foreground">Texto original:</div>
            <div className="px-3 py-1.5 rounded-md bg-background border border-border font-mono text-sm text-foreground">Hola</div>
            <div className="px-3 py-1.5 rounded-md bg-chart-2/10 border border-chart-2/30 font-mono text-xs text-chart-2 break-all">{hashA}</div>
          </div>
          <div className="space-y-1.5">
            <div className="text-xs text-muted-foreground">Un carácter adicional:</div>
            <div className="px-3 py-1.5 rounded-md bg-background border border-border font-mono text-sm">
              <span className="text-foreground">Hola</span>
              <span className="text-destructive font-bold">1</span>
            </div>
            <div className="px-3 py-1.5 rounded-md bg-destructive/10 border border-destructive/30 font-mono text-xs text-destructive break-all">{hashB}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-md bg-warning/10 border border-warning/20">
          <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0" />
          <p className="text-xs text-warning">Agregar &quot;1&quot; cambió completamente los 16 caracteres del hash.</p>
        </div>
      </div>
    </div>
  )
}

function TrazabilidadContent() {
  const steps = [
    { label: 'Producción', desc: 'El origen se registra en la blockchain', icon: <Package className="h-4 w-4" /> },
    { label: 'Transporte', desc: 'Cada movimiento genera un nuevo bloque', icon: <ArrowRight className="h-4 w-4" /> },
    { label: 'Distribución', desc: 'El historial es verificable en todo momento', icon: <Route className="h-4 w-4" /> },
    { label: 'Entrega', desc: 'Destino final con trazabilidad completa', icon: <CheckCircle className="h-4 w-4" /> },
  ]

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground leading-relaxed">
        La trazabilidad es la capacidad de seguir el recorrido de un producto, dato o transacción
        a lo largo del tiempo. Blockchain es ideal para esto porque cada evento queda registrado
        de forma permanente, ordenada e imposible de alterar.
      </p>

      <div className="p-4 rounded-lg bg-secondary/40 border border-border">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Ejemplo — cadena de suministro
        </p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 overflow-x-auto pb-1">
          {steps.map((step, i) => (
            <div key={step.label} className="flex sm:flex-col items-center gap-2 w-full sm:w-auto">
              <div className="px-3 py-2.5 rounded-lg border bg-warning/10 border-warning/30 text-center min-w-[100px] shrink-0">
                <div className="flex justify-center text-warning mb-1">{step.icon}</div>
                <div className="text-xs font-semibold text-warning">{step.label}</div>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight className="h-3.5 w-3.5 text-warning/60 shrink-0 rotate-90 sm:rotate-0" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-3 space-y-1">
          {steps.map((step) => (
            <div key={step.label} className="flex items-start gap-2 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-warning/60 shrink-0 mt-1.5" />
              <span>
                <span className="text-warning font-medium">{step.label}:</span>{' '}
                {step.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/5 border border-warning/20">
        <div className="p-1.5 rounded-md bg-warning/15 text-warning shrink-0 mt-0.5">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground mb-0.5">Beneficio clave</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Con blockchain, cualquier participante puede verificar el historial completo sin depender
            de una autoridad central. Los registros no pueden alterarse retroactivamente.
          </p>
        </div>
      </div>
    </div>
  )
}

const VALIDATION_STEPS = [
  null,
  {
    label: 'Transacción Pendiente',
    wrapperClasses: 'bg-warning/10 border-warning/30 text-warning',
    icon: <Clock className="h-4 w-4 shrink-0" />,
    desc: 'Una nueva transacción espera ser validada por la red.',
    nodeActive: [true, false, false],
  },
  {
    label: 'Nodos Verificando...',
    wrapperClasses: 'bg-chart-2/10 border-chart-2/30 text-chart-2',
    icon: <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin shrink-0" />,
    desc: 'Los nodos de la red comprueban la firma digital y el saldo disponible.',
    nodeActive: [true, true, false],
  },
  {
    label: '¡Bloque Aceptado!',
    wrapperClasses: 'bg-success/10 border-success/30 text-success',
    icon: <CheckCircle className="h-4 w-4 shrink-0" />,
    desc: 'La mayoría de los nodos validaron la transacción. El bloque se agrega a la cadena.',
    nodeActive: [true, true, true],
  },
] as const

function ValidacionContent() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (step === 0 || step === 3) return
    const delay = step === 1 ? 1500 : 2000
    const timer = setTimeout(() => setStep((s) => s + 1), delay)
    return () => clearTimeout(timer)
  }, [step])

  const current = step > 0 ? VALIDATION_STEPS[step] : null
  const nodeLabels = ['Transacción', 'Validación', 'Bloque']

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground leading-relaxed">
        Antes de que una transacción se registre en la blockchain, múltiples nodos de la red deben
        verificar que es válida. Solo cuando la mayoría alcanza consenso, el bloque se agrega
        de forma permanente a la cadena.
      </p>

      <div className="p-4 rounded-lg bg-secondary/40 border border-border space-y-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Mini simulación interactiva
        </p>

        <div className="flex items-center justify-center gap-3">
          {nodeLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-3">
              <div className={cn(
                'px-3 py-2 rounded-lg border text-center min-w-[85px] transition-all duration-500',
                current?.nodeActive[i]
                  ? 'bg-success/15 border-success/40 text-success shadow-sm'
                  : 'bg-secondary/50 border-border text-muted-foreground'
              )}>
                <div className="text-xs font-medium">{label}</div>
                <div className="text-[10px] mt-0.5 font-mono">
                  {current?.nodeActive[i] ? '✓ activo' : '○ espera'}
                </div>
              </div>
              {i < nodeLabels.length - 1 && (
                <div className={cn(
                  'h-px w-6 transition-all duration-500',
                  current?.nodeActive[i] ? 'bg-success' : 'bg-border'
                )} />
              )}
            </div>
          ))}
        </div>

        {current && (
          <div className={cn(
            'flex items-center gap-3 p-3 rounded-lg border transition-all duration-300',
            current.wrapperClasses
          )}>
            {current.icon}
            <div>
              <div className="text-sm font-semibold">{current.label}</div>
              <div className="text-xs opacity-80 mt-0.5">{current.desc}</div>
            </div>
          </div>
        )}

        <div>
          {step === 0 && (
            <Button size="sm" onClick={() => setStep(1)} className="text-xs gap-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              Simular Validación
            </Button>
          )}
          {step === 3 && (
            <Button size="sm" variant="outline" onClick={() => setStep(0)} className="text-xs">
              Reiniciar simulación
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { num: '01', title: 'Propuesta', desc: 'Un nodo propone la transacción a la red' },
          { num: '02', title: 'Verificación', desc: 'Cada nodo valida firma digital y saldo' },
          { num: '03', title: 'Consenso', desc: 'La mayoría aprueba y el bloque es definitivo' },
        ].map(({ num, title, desc }) => (
          <div key={num} className="p-3 rounded-lg bg-success/5 border border-success/15">
            <div className="text-xl font-bold text-success/30 font-mono leading-none mb-1">{num}</div>
            <div className="text-xs font-semibold text-foreground">{title}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function InmutabilidadContent() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground leading-relaxed">
        La inmutabilidad significa que una vez que un dato se registra en la blockchain, modificarlo
        requiere recalcular el hash de ese bloque y de todos los posteriores — algo que la red detecta
        y rechaza inmediatamente. Esto garantiza la integridad permanente de la información.
      </p>

      <div className="p-4 rounded-lg bg-secondary/40 border border-border space-y-4">
        <div>
          <p className="text-xs font-medium text-success flex items-center gap-1.5 mb-2">
            <CheckCircle className="h-3.5 w-3.5" /> Cadena íntegra
          </p>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['Génesis', 'Bloque #1', 'Bloque #2'].map((name, i) => (
              <div key={name} className="flex items-center gap-2 shrink-0">
                <div className="px-3 py-2 rounded-lg bg-success/10 border border-success/30 text-center min-w-[88px]">
                  <Package className="h-3.5 w-3.5 text-success mx-auto mb-1" />
                  <div className="text-xs font-mono text-success">{name}</div>
                  <div className="text-[10px] text-success/70 mt-0.5">✓ válido</div>
                </div>
                {i < 2 && <ArrowRight className="h-3.5 w-3.5 text-success shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-destructive flex items-center gap-1.5 mb-2">
            <XCircle className="h-3.5 w-3.5" /> Bloque #1 alterado — cadena comprometida
          </p>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { name: 'Génesis', valid: true, note: '✓ válido' },
              { name: 'Bloque #1', valid: false, note: '✗ ALTERADO' },
              { name: 'Bloque #2', valid: false, note: '✗ INVÁLIDO' },
            ].map((block, i) => (
              <div key={block.name} className="flex items-center gap-2 shrink-0">
                <div className={cn(
                  'px-3 py-2 rounded-lg border text-center min-w-[88px] transition-all duration-300',
                  block.valid
                    ? 'bg-success/10 border-success/30'
                    : 'bg-destructive/10 border-destructive/30 animate-pulse'
                )}>
                  <Package className={cn('h-3.5 w-3.5 mx-auto mb-1', block.valid ? 'text-success' : 'text-destructive')} />
                  <div className={cn('text-xs font-mono', block.valid ? 'text-success' : 'text-destructive')}>
                    {block.name}
                  </div>
                  <div className={cn('text-[10px] mt-0.5', block.valid ? 'text-success/70' : 'text-destructive/80 font-semibold')}>
                    {block.note}
                  </div>
                </div>
                {i < 2 && (
                  <ArrowRight className={cn('h-3.5 w-3.5 shrink-0', i === 0 ? 'text-destructive' : 'text-muted-foreground')} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-md bg-destructive/10 border border-destructive/20">
          <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0" />
          <p className="text-xs text-destructive">
            Al modificar el Bloque #1, su hash cambia e invalida todos los bloques posteriores.
          </p>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-secondary/20 border border-border">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="text-foreground font-medium">Pruébalo en el simulador:</span>{' '}
          Haz clic en cualquier bloque, edita sus datos y observa cómo la cadena se invalida
          en tiempo real.
        </p>
      </div>
    </div>
  )
}

function ConsensoContent() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground leading-relaxed">
        Los mecanismos de consenso son las reglas que determinan cómo los participantes de una
        blockchain acuerdan qué transacciones son válidas, sin necesitar una autoridad central
        que tome esa decisión.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-warning/5 border border-warning/25 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-warning/15 shrink-0">
              <Cpu className="h-5 w-5 text-warning" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">Proof of Work</div>
              <div className="text-xs text-warning font-medium">Prueba de Trabajo</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Los nodos compiten resolviendo complejos problemas matemáticos. El primero en
            resolverlo agrega el bloque y recibe una recompensa económica.
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3 text-success shrink-0" />
              Alta seguridad y descentralización
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <XCircle className="h-3 w-3 text-destructive shrink-0" />
              Alto consumo energético
            </div>
          </div>
          <div className="px-3 py-2 rounded-lg bg-warning/10 border border-warning/25 font-mono text-[11px] text-warning">
            Bitcoin → usa PoW
          </div>
        </div>

        <div className="p-4 rounded-xl bg-chart-2/5 border border-chart-2/25 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-chart-2/15 shrink-0">
              <Coins className="h-5 w-5 text-chart-2" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">Proof of Stake</div>
              <div className="text-xs text-chart-2 font-medium">Prueba de Participación</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Los validadores son seleccionados según la cantidad de criptomonedas que &quot;apuestan&quot;
            como garantía. Mayor participación = mayor probabilidad de validar.
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3 text-success shrink-0" />
              Más eficiente energéticamente
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <XCircle className="h-3 w-3 text-destructive shrink-0" />
              Riesgo de mayor concentración de poder
            </div>
          </div>
          <div className="px-3 py-2 rounded-lg bg-chart-2/10 border border-chart-2/25 font-mono text-[11px] text-chart-2">
            Ethereum → usa PoS
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { label: 'PoW en acción', value: 'Los nodos compiten resolviendo problemas matemáticos complejos para ganar el derecho a agregar el siguiente bloque.' },
          { label: 'PoS en acción', value: 'Los validadores depositan criptomonedas como garantía. Si actúan de forma deshonesta, pierden lo depositado.' },
        ].map(({ label, value }) => (
          <div key={label} className="p-3 rounded-lg bg-secondary/30 border border-border">
            <div className="text-xs font-semibold text-foreground mb-1">{label}</div>
            <div className="text-xs text-muted-foreground leading-relaxed">{value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function NodoContent() {
  const properties = [
    {
      icon: <Database className="h-4 w-4" />,
      title: 'Almacenamiento',
      desc: 'Guarda una copia completa e histórica de toda la blockchain.',
      color: 'text-chart-2',
      bg: 'bg-chart-2/10 border-chart-2/20',
    },
    {
      icon: <ShieldCheck className="h-4 w-4" />,
      title: 'Validación',
      desc: 'Verifica la autenticidad y validez de cada bloque recibido.',
      color: 'text-success',
      bg: 'bg-success/10 border-success/20',
    },
    {
      icon: <Wifi className="h-4 w-4" />,
      title: 'Comunicación',
      desc: 'Comparte información con los demás nodos de la red P2P.',
      color: 'text-primary',
      bg: 'bg-primary/10 border-primary/20',
    },
    {
      icon: <CheckCircle className="h-4 w-4" />,
      title: 'Consenso',
      desc: 'Participa en la votación para aceptar o rechazar bloques.',
      color: 'text-warning',
      bg: 'bg-warning/10 border-warning/20',
    },
  ]

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground leading-relaxed">
        Un nodo es cualquier computador o servidor que participa activamente en la red blockchain.
        No existe un nodo &quot;principal&quot; — todos tienen el mismo rango y responsabilidades.
        Cuantos más nodos, más robusta y descentralizada es la red.
      </p>

      {/* Node visual + properties */}
      <div className="p-4 rounded-lg bg-secondary/40 border border-border">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">
          Responsabilidades de un nodo
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {properties.map(({ icon, title, desc, color, bg }) => (
            <div key={title} className={cn('p-3 rounded-lg border', bg)}>
              <div className={cn('flex items-center gap-2 mb-1.5', color)}>
                {icon}
                <span className="text-xs font-semibold">{title}</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Network visual: node connected to others */}
      <div className="p-4 rounded-lg bg-secondary/40 border border-border">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Cómo se conecta un nodo
        </p>
        <div className="flex items-center justify-center gap-0">
          {/* Surrounding nodes */}
          {['Alpha', 'Beta', 'Gamma'].map((name, i) => (
            <div key={name} className="flex items-center gap-1">
              <div className="px-2 py-1.5 rounded-lg bg-primary/10 border border-primary/25 text-center">
                <Network className="h-3 w-3 text-primary mx-auto mb-0.5" />
                <div className="text-[9px] font-mono text-primary">{name}</div>
              </div>
              {i < 2 && (
                <div className="flex flex-col items-center gap-0.5 mx-1">
                  <div className="w-6 h-px bg-primary/30" />
                  <div className="w-6 h-px bg-primary/30 mt-1" />
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center italic">
          Cada nodo conoce la dirección de múltiples vecinos — así se propaga la información.
        </p>
      </div>

      <div className="p-3 rounded-lg bg-chart-2/5 border border-chart-2/20">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="text-foreground font-medium">En este simulador:</span>{' '}
          los nodos Alpha, Beta, Gamma y Delta representan participantes independientes de la red.
          Observa en el panel &quot;Red Blockchain Distribuida&quot; cómo cada uno mantiene su propia copia.
        </p>
      </div>
    </div>
  )
}

function DescentralizacionContent() {
  const advantages = [
    { label: 'Sin punto único de fallo', desc: 'Si un nodo cae, la red sigue funcionando.' },
    { label: 'Sin censura central',      desc: 'Ninguna entidad puede bloquear transacciones.' },
    { label: 'Transparencia total',      desc: 'Cualquiera puede verificar los datos.' },
    { label: 'Resistencia a ataques',    desc: 'Atacar la red requiere comprometer la mayoría de nodos.' },
  ]

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground leading-relaxed">
        La descentralización significa que ningún participante único controla la red.
        La información se distribuye entre todos los nodos — no existe un servidor central
        que pueda ser atacado, censurado o apagado para detener la red.
      </p>

      {/* Comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Centralizado */}
        <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/25 space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-destructive/15">
              <Server className="h-4 w-4 text-destructive" />
            </div>
            <span className="text-sm font-semibold text-foreground">Centralizado</span>
          </div>

          {/* Star topology SVG */}
          <div className="flex justify-center">
            <svg viewBox="0 0 120 90" className="w-28 h-20">
              {/* Spokes from center */}
              {[[-38,-28],[38,-28],[0,-40],[38,28],[-38,28]].map(([dx,dy], i) => (
                <line key={i} x1={60} y1={45} x2={60+dx} y2={45+dy}
                  stroke="var(--color-destructive)" strokeWidth="1" strokeOpacity="0.5" />
              ))}
              {/* Clients */}
              {[[-38,-28],[38,-28],[0,-40],[38,28],[-38,28]].map(([dx,dy], i) => (
                <circle key={i} cx={60+dx} cy={45+dy} r={7}
                  style={{ fill: 'var(--color-destructive)', fillOpacity: 0.15, stroke: 'var(--color-destructive)', strokeWidth: 1.5 }} />
              ))}
              {/* Central server */}
              <circle cx={60} cy={45} r={11}
                style={{ fill: 'var(--color-destructive)', fillOpacity: 0.25, stroke: 'var(--color-destructive)', strokeWidth: 2 }} />
              <text x={60} y={46} textAnchor="middle" dominantBaseline="middle"
                style={{ fill: 'var(--color-destructive)', fontSize: '7px', fontWeight: '700' }}>SRV</text>
            </svg>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <XCircle className="h-3 w-3 text-destructive shrink-0" />
              Un servidor central controla todo
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <XCircle className="h-3 w-3 text-destructive shrink-0" />
              Punto único de fallo
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <XCircle className="h-3 w-3 text-destructive shrink-0" />
              Sujeto a censura y control
            </div>
          </div>
          <div className="text-[10px] font-mono text-destructive/70 text-center">
            Ejemplo: banco tradicional
          </div>
        </div>

        {/* Descentralizado */}
        <div className="p-4 rounded-xl bg-success/5 border border-success/25 space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-success/15">
              <Share2 className="h-4 w-4 text-success" />
            </div>
            <span className="text-sm font-semibold text-foreground">Descentralizado</span>
          </div>

          {/* Mesh topology SVG */}
          <div className="flex justify-center">
            <svg viewBox="0 0 120 90" className="w-28 h-20">
              {/* All cross connections */}
              {[[22,20],[98,20],[22,70],[98,70]].flatMap((a, i, arr) =>
                arr.slice(i+1).map((b, j) => (
                  <line key={`${i}-${j}`}
                    x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}
                    stroke="var(--color-success)" strokeWidth="1" strokeOpacity="0.45" />
                ))
              )}
              {/* Nodes */}
              {[[22,20],[98,20],[22,70],[98,70]].map(([cx,cy], i) => (
                <circle key={i} cx={cx} cy={cy} r={11}
                  style={{ fill: 'var(--color-success)', fillOpacity: 0.15, stroke: 'var(--color-success)', strokeWidth: 1.5 }} />
              ))}
              {/* Node labels */}
              {[['A',22,20],['B',98,20],['C',22,70],['D',98,70]].map(([l,cx,cy]) => (
                <text key={String(l)} x={Number(cx)} y={Number(cy)+1} textAnchor="middle" dominantBaseline="middle"
                  style={{ fill: 'var(--color-success)', fontSize: '8px', fontWeight: '700' }}>{l}</text>
              ))}
            </svg>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <CheckCircle className="h-3 w-3 text-success shrink-0" />
              Todos los nodos son iguales
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <CheckCircle className="h-3 w-3 text-success shrink-0" />
              Sin punto único de fallo
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <CheckCircle className="h-3 w-3 text-success shrink-0" />
              Resistente a censura y ataques
            </div>
          </div>
          <div className="text-[10px] font-mono text-success/70 text-center">
            Ejemplo: Bitcoin, Ethereum
          </div>
        </div>
      </div>

      {/* Advantages grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {advantages.map(({ label, desc }) => (
          <div key={label} className="p-3 rounded-lg bg-primary/5 border border-primary/15">
            <div className="text-xs font-semibold text-foreground mb-0.5">{label}</div>
            <div className="text-[11px] text-muted-foreground leading-relaxed">{desc}</div>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-lg bg-secondary/20 border border-border">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="text-foreground font-medium">Observa en el simulador:</span>{' '}
          cuando alteras un bloque en un nodo, los otros 3 mantienen la cadena correcta.
          La red detecta la inconsistencia automáticamente — sin necesitar una autoridad central.
        </p>
      </div>
    </div>
  )
}

// ─── Accordion wrapper ────────────────────────────────────────────────────────

const CONTENT_MAP: Record<string, React.ReactNode> = {
  blockchain:        <BlockchainContent />,
  hash:              <HashContent />,
  trazabilidad:      <TrazabilidadContent />,
  validacion:        <ValidacionContent />,
  inmutabilidad:     <InmutabilidadContent />,
  consenso:          <ConsensoContent />,
  nodo:              <NodoContent />,
  descentralizacion: <DescentralizacionContent />,
}

interface AccordionTopicProps {
  topic: typeof TOPICS[number]
  isOpen: boolean
  onToggle: () => void
}

function AccordionTopic({ topic, isOpen, onToggle }: AccordionTopicProps) {
  return (
    <div className={cn(
      'rounded-xl border-2 overflow-hidden transition-all duration-300',
      isOpen
        ? `${topic.openBorder} ${topic.openBg} shadow-md`
        : 'bg-card border-border hover:border-border/60'
    )}>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 sm:gap-4 px-3 py-3 sm:px-5 sm:py-4 text-left hover:bg-white/[0.02] transition-colors duration-150"
        aria-expanded={isOpen}
      >
        <div className={cn(
          'p-2.5 rounded-lg shrink-0 transition-all duration-200',
          isOpen ? topic.iconOpen : 'bg-secondary/70 text-muted-foreground'
        )}>
          {topic.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-foreground">{topic.title}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{topic.subtitle}</div>
        </div>
        <ChevronDown className={cn(
          'h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-300',
          isOpen && 'rotate-180'
        )} />
      </button>

      <div className={cn(
        'grid transition-all duration-300 ease-in-out',
        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
      )}>
        <div className="overflow-hidden">
          <div className="px-3 pb-4 sm:px-5 sm:pb-5">
            {CONTENT_MAP[topic.id]}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Experimenta CTA ──────────────────────────────────────────────────────────

function ExperimentaCard({ onGoToSimulator }: { onGoToSimulator: () => void }) {
  return (
    <Card className="border-2 border-primary/35 bg-primary/5 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
      <CardContent className="pt-6 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/15 text-primary shrink-0">
            <FlaskConical className="h-8 w-8" />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="text-lg font-bold text-foreground">Experimenta</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ahora que conoces los conceptos básicos, utiliza el simulador para crear transacciones,
              generar bloques y observar cómo funciona la integridad de una blockchain en tiempo real.
            </p>
          </div>
          <Button onClick={onGoToSimulator} className="w-full sm:w-auto sm:shrink-0 gap-2">
            Ir al Simulador
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

interface EducationalModuleProps {
  onGoToSimulator: () => void
}

export function EducationalModule({ onGoToSimulator }: EducationalModuleProps) {
  const [openTopics, setOpenTopics] = useState<Set<string>>(new Set())
  const [visitedTopics, setVisitedTopics] = useState<Set<string>>(new Set())

  const toggleTopic = useCallback((id: string) => {
    setOpenTopics((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
    setVisitedTopics((prev) => new Set(prev).add(id))
  }, [])

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Module header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/15">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Módulo Educativo</h2>
            <p className="text-sm text-muted-foreground">Fundamentos de blockchain explicados con claridad</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/40 border border-border rounded-lg px-3 py-2 w-fit">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>{visitedTopics.size} de {TOPICS.length} temas explorados</span>
        </div>
      </div>

      {/* Accordion topics */}
      <div className="space-y-3">
        {TOPICS.map((topic) => (
          <AccordionTopic
            key={topic.id}
            topic={topic}
            isOpen={openTopics.has(topic.id)}
            onToggle={() => toggleTopic(topic.id)}
          />
        ))}
      </div>

      {/* Experimenta CTA */}
      <ExperimentaCard onGoToSimulator={onGoToSimulator} />
    </div>
  )
}
