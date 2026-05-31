"use client"

import { useState } from 'react'
import { type Block, truncateHash } from '@/lib/cadena-bloques'
import { useBlockchain } from '@/lib/contexto-cadena-bloques'
import { Card, CardContent } from '@/components/ui/tarjeta'
import { Badge } from '@/components/ui/insignia'
import { Button } from '@/components/ui/boton'
import { Input } from '@/components/ui/entrada'
import { Label } from '@/components/ui/etiqueta'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/informacion-herramienta'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialogo'
import { 
  Hash, 
  Link2, 
  ShieldCheck, 
  ShieldAlert, 
  Pencil,
  ArrowRightLeft,
  Package,
  ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utilidades'

interface BlockCardProps {
  block: Block
  isFirst?: boolean
  isHighlighted?: boolean
}

export function BlockCard({ block, isFirst = false, isHighlighted = false }: BlockCardProps) {
  const { selectBlock, selectedBlock, alterBlock, isAnimating, blockEditState, isDemoMode, demoStep } = useBlockchain()
  const isSelected = selectedBlock?.index === block.index
  const isGenesis = block.index === 0
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editFrom, setEditFrom] = useState('')
  const [editTo, setEditTo] = useState('')
  const [editAmount, setEditAmount] = useState('')

  // Check if this block has been altered (has edit state)
  const wasAltered = blockEditState?.blockIndex === block.index && !blockEditState.isEditing

  const handleOpenEdit = () => {
    if (block.transactions.length > 0) {
      const tx = block.transactions[0]
      setEditFrom(tx.from)
      setEditTo(tx.to)
      setEditAmount(tx.amount.toString())
    }
    setIsEditDialogOpen(true)
  }

  const handleConfirmEdit = () => {
    alterBlock(block.index, {
      from: editFrom || undefined,
      to: editTo || undefined,
      amount: editAmount ? parseFloat(editAmount) : undefined,
    })
    setIsEditDialogOpen(false)
  }

  // Highlight edit button in demo mode step 6
  const shouldHighlightEdit = isDemoMode && demoStep === 6 && !isGenesis && block.isValid

  return (
    <div className="relative">
      <Card
        className={cn(
          "w-72 cursor-pointer transition-all duration-300 border-2",
          block.isValid
            ? "border-border hover:border-primary/50 bg-card"
            : "border-destructive bg-destructive/5 animate-shake",
          isSelected && "border-primary shadow-lg shadow-primary/20",
          isHighlighted && "ring-2 ring-primary ring-offset-2 ring-offset-background animate-pulse"
        )}
        onClick={() => selectBlock(block)}
      >
        {/* Block header with status */}
        <div className={cn(
          "px-4 py-3 border-b flex items-center justify-between",
          block.isValid ? "border-border" : "border-destructive/30"
        )}>
          <div className="flex items-center gap-2">
            <div className={cn(
              "p-1.5 rounded-lg",
              block.isValid ? "bg-primary/10" : "bg-destructive/10"
            )}>
              <Package className={cn(
                "h-4 w-4",
                block.isValid ? "text-primary" : "text-destructive"
              )} />
            </div>
            <span className="font-mono font-semibold text-lg">
              Bloque #{block.index}
            </span>
            {isGenesis && (
              <Badge variant="secondary" className="text-[10px] px-1.5">
                Genesis
              </Badge>
            )}
          </div>
          
          {block.isValid ? (
            <Badge className="bg-success/20 text-success border-success/30 text-[10px]">
              <ShieldCheck className="h-3 w-3 mr-1" />
              Valido
            </Badge>
          ) : (
            <Badge variant="destructive" className="animate-pulse text-[10px]">
              <ShieldAlert className="h-3 w-3 mr-1" />
              Invalido
            </Badge>
          )}
        </div>
        
        <CardContent className="p-4 space-y-3">
          {/* Transactions display */}
          {block.transactions.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ArrowRightLeft className="h-3 w-3" />
                <span>{block.transactions.length} transaccion{block.transactions.length > 1 ? 'es' : ''}</span>
              </div>
              {block.transactions.map((tx, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm bg-secondary/30 rounded-lg p-2">
                  <span className="font-medium text-foreground">{tx.from}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span className="font-medium text-foreground">{tx.to}</span>
                  <Badge variant="outline" className="ml-auto text-[10px]">${tx.amount}</Badge>
                </div>
              ))}
            </div>
          )}

          {/* Hash display with before/after if altered */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={cn(
                  "flex items-center gap-2 p-2 rounded-lg cursor-help",
                  wasAltered ? "bg-destructive/10 border border-destructive/20" : "bg-secondary/50"
                )}>
                  <Hash className={cn(
                    "h-4 w-4 shrink-0",
                    wasAltered ? "text-destructive" : "text-primary"
                  )} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-muted-foreground">
                      {wasAltered ? "Hash (Alterado)" : "Hash del bloque"}
                    </p>
                    
                    {/* Show before/after comparison if altered */}
                    {wasAltered && blockEditState && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] text-muted-foreground">Antes:</span>
                          <code className="font-mono text-[10px] text-muted-foreground line-through truncate">
                            {truncateHash(blockEditState.originalHash, 8)}
                          </code>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] text-destructive">Ahora:</span>
                          <code className="font-mono text-xs text-destructive truncate">
                            {truncateHash(block.hash, 8)}
                          </code>
                        </div>
                      </div>
                    )}
                    
                    {!wasAltered && (
                      <code className={cn(
                        "font-mono text-xs truncate block",
                        block.isValid ? "text-primary" : "text-destructive"
                      )}>
                        {truncateHash(block.hash, 8)}
                      </code>
                    )}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <p className="text-xs font-mono break-all">{block.hash}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Previous hash - simplified */}
          {!isGenesis && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={cn(
                    "flex items-center gap-2 p-2 rounded-lg cursor-help",
                    block.isValid ? "bg-chart-2/10" : "bg-destructive/5"
                  )}>
                    <Link2 className={cn(
                      "h-4 w-4 shrink-0",
                      block.isValid ? "text-chart-2" : "text-destructive"
                    )} />
                    <div className="min-w-0">
                      <p className="text-[10px] text-muted-foreground">Conexion anterior</p>
                      <code className={cn(
                        "font-mono text-xs truncate block",
                        block.isValid ? "text-chart-2" : "text-destructive"
                      )}>
                        {truncateHash(block.previousHash, 8)}
                      </code>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="text-xs font-mono break-all">{block.previousHash}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Edit button - only for non-genesis valid blocks */}
          {!isGenesis && block.isValid && (
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "w-full text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30",
                    shouldHighlightEdit && "ring-2 ring-destructive ring-offset-2 ring-offset-background animate-pulse"
                  )}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleOpenEdit()
                  }}
                  disabled={isAnimating}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar Bloque
                  {shouldHighlightEdit && (
                    <Badge variant="destructive" className="ml-2 text-[10px]">
                      Paso 6
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] sm:max-w-md" onClick={e => e.stopPropagation()}>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Pencil className="h-5 w-5 text-destructive" />
                    Editar Bloque #{block.index}
                  </DialogTitle>
                  <DialogDescription>
                    Modifica los datos del bloque para demostrar como cambia el hash y se invalida la cadena.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  {/* Current hash display */}
                  <div className="p-3 rounded-lg bg-secondary/50 border">
                    <p className="text-xs text-muted-foreground mb-1">Hash actual del bloque:</p>
                    <code className="font-mono text-xs text-primary break-all">
                      {block.hash}
                    </code>
                  </div>

                  {/* Edit fields */}
                  {block.transactions.length > 0 ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="edit-from" className="text-xs">Emisor</Label>
                          <Input
                            id="edit-from"
                            value={editFrom}
                            onChange={(e) => setEditFrom(e.target.value)}
                            placeholder="Nombre del emisor"
                            className="h-9"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-to" className="text-xs">Receptor</Label>
                          <Input
                            id="edit-to"
                            value={editTo}
                            onChange={(e) => setEditTo(e.target.value)}
                            placeholder="Nombre del receptor"
                            className="h-9"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-amount" className="text-xs">Cantidad</Label>
                        <Input
                          id="edit-amount"
                          type="number"
                          value={editAmount}
                          onChange={(e) => setEditAmount(e.target.value)}
                          placeholder="Cantidad"
                          className="h-9"
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Este bloque sera marcado como alterado
                    </p>
                  )}

                  {/* Warning */}
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm">
                    <p className="text-destructive font-medium mb-1">Advertencia:</p>
                    <p className="text-muted-foreground text-xs">
                      Al modificar cualquier dato, el hash del bloque cambiara completamente. 
                      Esto invalidara este bloque y todos los siguientes.
                    </p>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button variant="destructive" onClick={handleConfirmEdit}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Confirmar Alteracion
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* Invalid block indicator */}
          {!block.isValid && (
            <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/20 text-center">
              <p className="text-xs text-destructive font-medium">
                Hash no coincide con el bloque anterior
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
