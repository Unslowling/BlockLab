"use client"

import { useBlockchain } from '@/lib/contexto-cadena-bloques'
import { CURRENCIES } from '@/lib/cadena-bloques'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/tarjeta'
import { Button } from '@/components/ui/boton'
import { Badge } from '@/components/ui/insignia'
import { ScrollArea } from '@/components/ui/area-desplazamiento'
import { Clock, ArrowRight, User, Coins, Package } from 'lucide-react'
import { cn } from '@/lib/utilidades'

function getCurrencyLabel(currency?: string): string {
  return CURRENCIES.find(c => c.id === currency)?.label ?? 'Coins'
}

export function PendingTransactions() {
  const { pendingTransactions, createBlockFromPending, isAnimating, isDemoMode, demoStep } = useBlockchain()

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="p-2 rounded-lg bg-warning/10">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              {pendingTransactions.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-warning text-[10px] font-bold items-center justify-center text-warning-foreground">
                    {pendingTransactions.length}
                  </span>
                </span>
              )}
            </div>
            <div>
              <CardTitle className="text-lg">Transacciones Pendientes</CardTitle>
              <CardDescription>
                Esperando ser agrupadas en un bloque
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {pendingTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-4 rounded-full bg-muted/50 mb-3">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              No hay transacciones pendientes
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Crea una transaccion para comenzar
            </p>
          </div>
        ) : (
          <>
            {/* Demo mode contextual message */}
            {isDemoMode && demoStep === 2 && (
              <div className="p-3 rounded-lg border border-primary/30 bg-primary/5 animate-in fade-in-50 slide-in-from-top-2 duration-500">
                <p className="text-xs text-primary/90 leading-relaxed">
                  <span className="font-semibold">✓</span> La transaccion fue agregada correctamente y ahora esta esperando ser agrupada dentro de un bloque.
                </p>
              </div>
            )}

            <ScrollArea className="h-[200px]">
              <div className="space-y-2 pr-4">
                {pendingTransactions.map((tx, index) => {
                  const currencyLabel = getCurrencyLabel(tx.currency)
                  return (
                    <div
                      key={tx.id}
                      className={cn(
                        "p-3 rounded-lg border border-warning/30 bg-warning/5 transition-all",
                        "animate-in slide-in-from-top-2 duration-300"
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Emisor → Receptor → Valor */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Emisor */}
                        <div className="flex items-center gap-1.5">
                          <div className="p-1 rounded bg-primary/20">
                            <User className="h-3 w-3 text-primary" />
                          </div>
                          <span className="text-sm font-medium">{tx.from}</span>
                        </div>

                        <ArrowRight className="h-4 w-4 text-warning flex-shrink-0" />

                        {/* Receptor */}
                        <div className="flex items-center gap-1.5">
                          <div className="p-1 rounded bg-chart-2/20">
                            <User className="h-3 w-3 text-chart-2" />
                          </div>
                          <span className="text-sm font-medium">{tx.to}</span>
                        </div>

                        <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />

                        {/* Valor con moneda */}
                        <Badge
                          variant="outline"
                          className="text-warning border-warning/50 font-mono gap-1 flex items-center"
                        >
                          <Coins className="h-3 w-3" />
                          {tx.amount} {currencyLabel}
                        </Badge>
                      </div>

                      {/* Subtexto educativo */}
                      <p className="text-[10px] text-muted-foreground/60 mt-1.5">
                        Intercambio de valor dentro de la blockchain
                      </p>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>

            <Button
              className="w-full"
              size="lg"
              onClick={createBlockFromPending}
              disabled={isAnimating}
            >
              <Package className="h-4 w-4 mr-2" />
              Crear Bloque con {pendingTransactions.length} Transaccion{pendingTransactions.length > 1 ? 'es' : ''}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
