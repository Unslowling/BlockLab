"use client"

import { useState } from 'react'
import { useBlockchain, USERS } from '@/lib/contexto-cadena-bloques'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/tarjeta'
import { Button } from '@/components/ui/boton'
import { Input } from '@/components/ui/entrada'
import { Label } from '@/components/ui/etiqueta'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/selector'
import { ArrowRight, Plus, User, Coins } from 'lucide-react'
import { cn } from '@/lib/utilidades'

export function TransactionForm() {
  const { createTransaction, isAnimating } = useBlockchain()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!from || !to || !amount || from === to) return
    
    createTransaction(from, to, parseInt(amount))
    setShowSuccess(true)
    
    // Reset form
    setFrom('')
    setTo('')
    setAmount('')
    
    setTimeout(() => setShowSuccess(false), 2000)
  }

  const availableRecipients = USERS.filter(user => user !== from)

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Plus className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Crear Transaccion</CardTitle>
            <CardDescription>
              Simula un intercambio de valor entre usuarios
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Visual transaction preview */}
          <div className="flex items-center justify-center gap-2 py-3 sm:py-4 px-3 bg-secondary/30 rounded-lg border border-border flex-wrap">
            <div className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
              from ? "bg-primary/20 border border-primary/30" : "bg-muted/50 border border-dashed border-muted-foreground/30"
            )}>
              <User className="h-4 w-4 text-primary" />
              <span className={cn("text-sm font-medium", !from && "text-muted-foreground")}>
                {from || "Emisor"}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <ArrowRight className={cn(
                "h-5 w-5 transition-colors",
                from && to ? "text-primary" : "text-muted-foreground/50"
              )} />
              {amount && (
                <span className="text-xs font-mono bg-chart-4/20 text-chart-4 px-2 py-0.5 rounded flex items-center gap-1">
                  <Coins className="h-3 w-3" />
                  {amount} Coins
                </span>
              )}
            </div>
            
            <div className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
              to ? "bg-chart-2/20 border border-chart-2/30" : "bg-muted/50 border border-dashed border-muted-foreground/30"
            )}>
              <User className="h-4 w-4 text-chart-2" />
              <span className={cn("text-sm font-medium", !to && "text-muted-foreground")}>
                {to || "Receptor"}
              </span>
            </div>
          </div>

          {/* Form fields */}
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="from" className="text-sm text-muted-foreground">
                  Emisor
                </Label>
                <Select value={from} onValueChange={setFrom}>
                  <SelectTrigger id="from">
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {USERS.map(user => (
                      <SelectItem key={user} value={user}>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {user}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="to" className="text-sm text-muted-foreground">
                  Receptor
                </Label>
                <Select value={to} onValueChange={setTo} disabled={!from}>
                  <SelectTrigger id="to">
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRecipients.map(user => (
                      <SelectItem key={user} value={user}>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {user}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm text-muted-foreground">
                Cantidad
              </Label>
              <div className="relative">
                <Coins className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  max="1000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Ej: 50"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!from || !to || !amount || from === to || isAnimating}
          >
            {showSuccess ? (
              <>Transaccion Creada</>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Transaccion
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
