"use client"

import { useEffect, useRef } from 'react'
import { useBlockchain, DEMO_STEPS } from '@/lib/contexto-cadena-bloques'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/tarjeta'
import { Button } from '@/components/ui/boton'
import { Badge } from '@/components/ui/insignia'
import { Progress } from '@/components/ui/progreso'
import { Play, X, Check, Circle, Sparkles, PartyPopper } from 'lucide-react'
import { cn } from '@/lib/utilidades'

export function DemoModePanel() {
  const { 
    isDemoMode, 
    demoStep,
    completedSteps,
    startDemoMode, 
    stopDemoMode,
    getStepStatus,
  } = useBlockchain()
  
  const stepsContainerRef = useRef<HTMLDivElement>(null)
  const activeStepRef = useRef<HTMLDivElement>(null)

  // Scroll the internal steps list to center the active step.
  // Uses container.scrollTo() instead of scrollIntoView() to avoid
  // triggering a page-level scroll that would fight the AutoScrollDemo.
  useEffect(() => {
    const container = stepsContainerRef.current
    const step = activeStepRef.current
    if (!container || !step) return

    const target = step.offsetTop - container.clientHeight / 2 + step.clientHeight / 2
    container.scrollTo({ top: Math.max(0, target), behavior: 'smooth' })
  }, [demoStep])

  const progressPercentage = (completedSteps.length / DEMO_STEPS.length) * 100
  const isComplete = completedSteps.length >= DEMO_STEPS.length

  if (!isDemoMode) {
    return (
      <Card className="bg-gradient-to-br from-primary/10 via-chart-2/5 to-primary/10 border-primary/20 overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-chart-2/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        
        <CardContent className="pt-6 relative">
          <div className="text-center space-y-4">
            <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-chart-2/20 w-fit mx-auto ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
              <Play className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">Modo Demostracion</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Guia interactiva paso a paso ideal para presentaciones academicas
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="bg-background/50">7 pasos guiados</Badge>
              <Badge variant="outline" className="bg-background/50">Progreso automatico</Badge>
              <Badge variant="outline" className="bg-background/50">Visual e intuitivo</Badge>
            </div>
            <Button onClick={startDemoMode} className="w-full group">
              <Sparkles className="h-4 w-4 mr-2 group-hover:animate-pulse" />
              Iniciar Demostracion Interactiva
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-primary/30 bg-card overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Play className="h-4 w-4 text-primary" />
              </div>
              Modo Demostracion
            </CardTitle>
            <CardDescription className="mt-1">
              {isComplete 
                ? "Demostracion completada" 
                : `Paso ${Math.min(demoStep, DEMO_STEPS.length)} de ${DEMO_STEPS.length}`
              }
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={stopDemoMode} className="hover:bg-destructive/10 hover:text-destructive">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-4">
        {/* Progress bar with percentage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progreso</span>
            <span className="font-medium text-primary">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Steps list */}
        <div ref={stepsContainerRef} className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          {DEMO_STEPS.map((step) => {
            const status = getStepStatus(step.step)
            const isActive = status === 'active'
            const isCompleted = status === 'completed'
            
            return (
              <div
                key={step.step}
                ref={isActive ? activeStepRef : null}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border transition-all duration-500",
                  isActive && "border-primary bg-primary/10 shadow-lg shadow-primary/5",
                  isCompleted && "border-success/30 bg-success/5",
                  !isActive && !isCompleted && "border-border bg-secondary/20 opacity-60"
                )}
              >
                {/* Step indicator */}
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-500",
                  isCompleted && "bg-success text-success-foreground scale-110",
                  isActive && "bg-primary text-primary-foreground ring-4 ring-primary/20 animate-pulse",
                  !isActive && !isCompleted && "bg-muted text-muted-foreground"
                )}>
                  {isCompleted ? (
                    <Check className="h-4 w-4 animate-in zoom-in-50 duration-300" />
                  ) : (
                    <Circle className={cn("h-3 w-3", isActive && "fill-current")} />
                  )}
                </div>
                
                {/* Step content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={cn(
                      "text-sm font-medium transition-colors",
                      isActive && "text-foreground",
                      isCompleted && "text-success",
                      !isActive && !isCompleted && "text-muted-foreground"
                    )}>
                      {step.title}
                    </p>
                    {isActive && (
                      <Badge variant="outline" className="text-primary border-primary/30 text-[10px] animate-pulse">
                        Actual
                      </Badge>
                    )}
                    {isCompleted && (
                      <Badge className="bg-success/20 text-success border-success/30 text-[10px]">
                        Completado
                      </Badge>
                    )}
                  </div>
                  
                  {/* Show description for active step */}
                  {isActive && (
                    <p className="text-xs text-muted-foreground mt-1 animate-in fade-in-50 duration-300">
                      {step.description}
                    </p>
                  )}
                  
                  {/* Show completed message for completed step */}
                  {isCompleted && (
                    <p className="text-xs text-success/80 mt-1 animate-in fade-in-50 slide-in-from-left-2 duration-300">
                      {step.completedMessage}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Completion celebration */}
        {isComplete && (
          <div className="text-center p-6 bg-gradient-to-br from-success/10 to-primary/10 rounded-lg border border-success/20 animate-in zoom-in-95 duration-500">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-success/20 mb-3">
              <PartyPopper className="h-8 w-8 text-success animate-bounce" />
            </div>
            <h4 className="text-lg font-semibold text-success mb-1">Demostracion Completada</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Has completado todos los pasos del simulador de blockchain descentralizada.
              Ahora entiendes como los nodos propagan informacion, alcanzan consenso y mantienen la integridad distribuida de la cadena.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button variant="outline" onClick={stopDemoMode} className="w-full sm:w-auto">
                Salir del modo demo
              </Button>
              <Button onClick={startDemoMode} className="w-full sm:w-auto">
                <Play className="h-4 w-4 mr-2" />
                Reiniciar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
