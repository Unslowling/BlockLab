"use client"

import { useEffect, useState } from 'react'
import { useBlockchain } from '@/lib/contexto-cadena-bloques'
import { Card, CardContent } from '@/components/ui/tarjeta'
import { Hash, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utilidades'

const HASH_CHARS = '0123456789abcdef'

function generateRandomHash(): string {
  let hash = '0x'
  for (let i = 0; i < 64; i++) {
    hash += HASH_CHARS[Math.floor(Math.random() * HASH_CHARS.length)]
  }
  return hash
}

export function HashAnimation() {
  const { isHashAnimating } = useBlockchain()
  const [displayHash, setDisplayHash] = useState(generateRandomHash())
  const [iterations, setIterations] = useState(0)

  useEffect(() => {
    if (!isHashAnimating) {
      setIterations(0)
      return
    }

    const interval = setInterval(() => {
      setDisplayHash(generateRandomHash())
      setIterations(prev => prev + 1)
    }, 50) // Fast hash changes

    return () => clearInterval(interval)
  }, [isHashAnimating])

  if (!isHashAnimating) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-lg mx-4 border-primary/50 shadow-2xl shadow-primary/20">
        <CardContent className="pt-8 pb-8 space-y-6">
          {/* Animated icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-pulse" />
              <div className="relative p-6 rounded-full bg-gradient-to-br from-primary/20 to-chart-2/20 ring-2 ring-primary/30">
                <Hash className="h-12 w-12 text-primary animate-spin" style={{ animationDuration: '2s' }} />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-foreground flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              Generando Hash Criptografico
            </h3>
            <p className="text-sm text-muted-foreground">
              El algoritmo esta calculando la huella digital unica del bloque...
            </p>
          </div>

          {/* Hash display with scrambling effect */}
          <div className="space-y-3">
            <div className="relative overflow-hidden rounded-lg bg-secondary/50 p-4 border border-primary/20">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer" />
              <code className={cn(
                "font-mono text-xs sm:text-sm text-primary break-all block relative",
                "animate-pulse"
              )}>
                {displayHash}
              </code>
            </div>
            
            {/* Progress indicator */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Calculando...</span>
              <span className="font-mono">{iterations} iteraciones</span>
            </div>
            
            {/* Visual progress dots */}
            <div className="flex justify-center gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>

          {/* Educational note */}
          <div className="text-center text-xs text-muted-foreground bg-secondary/30 rounded-lg p-3">
            <strong className="text-foreground">Dato educativo:</strong> En blockchain real, 
            este proceso puede requerir millones de iteraciones para encontrar un hash valido.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
