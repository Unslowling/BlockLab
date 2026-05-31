"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import {
  type Block,
  type Transaction,
  createGenesisBlock,
  createBlock,
  validateChain,
  calculateHash,
  USERS,
  CURRENCIES,
} from './cadena-bloques'

// ─── Network types ────────────────────────────────────────────────────────────

export type NodeId = 'alpha' | 'beta' | 'gamma' | 'delta'
export type NodeStatus = 'synced' | 'validating' | 'altered' | 'syncing'
export type PropagationPhase = 'idle' | 'propagating' | 'validating' | 'consensus' | 'syncing'
export type NetworkStatus = 'healthy' | 'degraded' | 'compromised'

export interface VirtualNode {
  id: NodeId
  name: string
  chain: Block[]
  status: NodeStatus
  vote: 'approved' | 'rejected' | null
}

export interface ConsensusResult {
  approved: number
  rejected: number
  total: number
  passed: boolean
}

const NODE_CONFIGS: Array<{ id: NodeId; name: string }> = [
  { id: 'alpha', name: 'Nodo Alpha' },
  { id: 'beta',  name: 'Nodo Beta'  },
  { id: 'gamma', name: 'Nodo Gamma' },
  { id: 'delta', name: 'Nodo Delta' },
]

// ─── Explanations ─────────────────────────────────────────────────────────────

export const EXPLANATIONS = {
  idle: {
    title: "Bienvenido al Simulador",
    description: "Comienza creando una transaccion para ver como funciona una blockchain descentralizada paso a paso.",
    icon: "welcome",
  },
  transactionCreated: {
    title: "Transaccion Creada",
    description: "La transaccion fue creada. Ahora sera propagada a todos los nodos de la red para su validacion.",
    icon: "transaction",
  },
  pendingTransactions: {
    title: "Transacciones Pendientes",
    description: "Las transacciones pendientes esperan ser agrupadas en un bloque. Los nodos de la red tienen conocimiento de ellas.",
    icon: "pending",
  },
  hashGenerating: {
    title: "Generando Hash...",
    description: "El sistema esta calculando la huella digital unica del bloque.",
    icon: "hash",
  },
  blockCreated: {
    title: "Bloque Creado",
    description: "El bloque agrupa transacciones para almacenarlas de forma segura. Cada bloque tiene un identificador unico llamado hash.",
    icon: "block",
  },
  hashGenerated: {
    title: "Hash Generado",
    description: "Cada bloque obtiene un hash unico. Cualquier cambio en los datos produce un hash completamente diferente.",
    icon: "hash",
  },
  blockConnected: {
    title: "Bloque Conectado en Toda la Red",
    description: "El bloque fue validado por consenso y replicado en todos los nodos. La cadena crece de forma sincronizada.",
    icon: "chain",
  },
  chainValid: {
    title: "Red Sincronizada",
    description: "Todos los nodos tienen la misma cadena integra. Los hashes coinciden en toda la red descentralizada.",
    icon: "valid",
  },
  chainInvalid: {
    title: "Integridad Comprometida",
    description: "Un nodo tiene una cadena alterada. Los otros nodos mantienen la version correcta: esto es la descentralizacion en accion.",
    icon: "invalid",
  },
  blockAltered: {
    title: "Bloque Alterado en un Nodo",
    description: "El contenido del bloque fue modificado en el nodo seleccionado. Su hash cambio. Los otros nodos rechazan esta version.",
    icon: "altered",
  },
  networkPropagating: {
    title: "Propagando a la Red",
    description: "La transaccion se propaga a los 4 nodos. Cada nodo recibe la solicitud y comienza a validarla de forma independiente.",
    icon: "network",
  },
  consensusRunning: {
    title: "Nodos Validando",
    description: "Los 4 nodos de la red estan verificando el bloque. Cada nodo vota de forma independiente sin depender de una autoridad central.",
    icon: "validating",
  },
  consensusReached: {
    title: "Consenso Alcanzado",
    description: "La mayoria de los nodos aprobo el bloque. El protocolo de consenso garantiza que todos esten de acuerdo antes de registrarlo.",
    icon: "valid",
  },
  nodeAltered: {
    title: "Nodo Comprometido",
    description: "Un nodo tiene su cadena alterada. Los otros 3 nodos conservan la version correcta. La red detecta y rechaza la version invalida.",
    icon: "altered",
  },
  nodeSyncing: {
    title: "Sincronizando Red",
    description: "Todos los nodos actualizan su copia con el nuevo bloque. La replicacion distribuida garantiza que todos tengan la misma informacion.",
    icon: "syncing",
  },
} as const

export type ExplanationType = keyof typeof EXPLANATIONS

// ─── Demo mode ───────────────────────────────────────────────────────────────

export const DEMO_STEPS = [
  {
    step: 1,
    title: "Crear Transaccion",
    description: "Simula un intercambio entre dos usuarios de la red",
    action: "createTransaction",
    completedMessage: "La transaccion fue creada y propagada a los nodos.",
  },
  {
    step: 2,
    title: "Ver Pendientes",
    description: "La transaccion espera ser agrupada en un bloque.",
    action: "viewPending",
    completedMessage: "La transaccion esta pendiente en todos los nodos de la red.",
  },
  {
    step: 3,
    title: "Crear Bloque",
    description: "Agrupa las transacciones y lanza el consenso",
    action: "createBlock",
    completedMessage: "El bloque sera validado por los nodos antes de agregarse.",
  },
  {
    step: 4,
    title: "Ver Consenso",
    description: "Observa como los nodos votan para aceptar el bloque",
    action: "viewHash",
    completedMessage: "Los nodos alcanzaron consenso y aprobaron el bloque.",
  },
  {
    step: 5,
    title: "Replicacion",
    description: "El bloque se replica en todos los nodos",
    action: "connectBlock",
    completedMessage: "El bloque fue replicado en los 4 nodos de la red.",
  },
  {
    step: 6,
    title: "Alterar Nodo",
    description: "Intenta modificar un bloque en un nodo",
    action: "alterBlock",
    completedMessage: "El nodo quedo comprometido. Los otros mantienen la cadena correcta.",
  },
  {
    step: 7,
    title: "Ver Inconsistencia",
    description: "Observa como la red detecta el nodo alterado",
    action: "viewIntegrity",
    completedMessage: "La red detecto la inconsistencia. La descentralizacion protege la integridad.",
  },
] as const

export type DemoStepStatus = 'pending' | 'active' | 'completed'

// ─── Context type ─────────────────────────────────────────────────────────────

interface BlockEditState {
  blockIndex: number
  originalHash: string
  newHash: string
  isEditing: boolean
}

interface BlockchainContextType {
  // Derived from selected node
  chain: Block[]
  isChainValid: boolean
  blockCount: number

  // Shared state
  pendingTransactions: Transaction[]
  selectedBlock: Block | null
  currentExplanation: ExplanationType
  isDemoMode: boolean
  demoStep: number
  completedSteps: number[]
  isAnimating: boolean
  isHashAnimating: boolean
  highlightedBlockIndex: number | null
  blockEditState: BlockEditState | null
  transactionCount: number

  // Network state
  nodes: VirtualNode[]
  selectedNodeId: NodeId
  propagationPhase: PropagationPhase
  consensusResult: ConsensusResult | null
  networkStatus: NetworkStatus
  syncedNodeCount: number

  // Existing actions
  createTransaction: (from: string, to: string, amount: number) => void
  createBlockFromPending: () => void
  selectBlock: (block: Block | null) => void
  alterBlock: (index: number, newData?: { from?: string; to?: string; amount?: number }) => void
  resetChain: () => void
  setExplanation: (explanation: ExplanationType) => void
  startDemoMode: () => void
  stopDemoMode: () => void
  setHighlightedBlock: (index: number | null) => void
  completeStep: (step: number) => void
  getStepStatus: (step: number) => DemoStepStatus
  startBlockEdit: (blockIndex: number) => void
  cancelBlockEdit: () => void

  // Network actions
  selectNode: (id: NodeId) => void
  syncNode: (nodeId: NodeId) => void
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined)

// ─── Provider ─────────────────────────────────────────────────────────────────

function makeInitialNodes(genesis: Block): VirtualNode[] {
  return NODE_CONFIGS.map(cfg => ({
    ...cfg,
    chain: [genesis],
    status: 'synced' as const,
    vote: null,
  }))
}

export function BlockchainProvider({ children }: { children: ReactNode }) {
  // Network state
  const [nodes, setNodes] = useState<VirtualNode[]>([])
  const [selectedNodeId, setSelectedNodeId] = useState<NodeId>('alpha')
  const [propagationPhase, setPropagationPhase] = useState<PropagationPhase>('idle')
  const [consensusResult, setConsensusResult] = useState<ConsensusResult | null>(null)

  // Shared state
  const [pendingTransactions, setPendingTransactions] = useState<Transaction[]>([])
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null)
  const [currentExplanation, setCurrentExplanation] = useState<ExplanationType>('idle')
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [demoStep, setDemoStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [isHashAnimating, setIsHashAnimating] = useState(false)
  const [highlightedBlockIndex, setHighlightedBlockIndex] = useState<number | null>(null)
  const [blockEditState, setBlockEditState] = useState<BlockEditState | null>(null)
  const [transactionCount, setTransactionCount] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize on client to avoid hydration mismatch
  useEffect(() => {
    if (!isInitialized) {
      setNodes(makeInitialNodes(createGenesisBlock()))
      setIsInitialized(true)
    }
  }, [isInitialized])

  // ── Derived values ──────────────────────────────────────────────────────────

  const selectedNode = nodes.find(n => n.id === selectedNodeId)
  const chain = selectedNode?.chain ?? []
  const isChainValid = chain.length > 0 && chain.every(b => b.isValid)
  const blockCount = chain.length
  const syncedNodeCount = nodes.filter(n => n.status === 'synced').length
  const networkStatus: NetworkStatus =
    syncedNodeCount === nodes.length ? 'healthy' :
    syncedNodeCount >= Math.ceil(nodes.length / 2) ? 'degraded' : 'compromised'

  // ── Demo auto-advance ───────────────────────────────────────────────────────

  useEffect(() => {
    if (!isDemoMode) return

    if (demoStep === 2 && pendingTransactions.length > 0 && completedSteps.includes(1)) {
      if (!completedSteps.includes(2)) {
        const t = setTimeout(() => {
          setCompletedSteps(prev => [...prev, 2])
          setDemoStep(3)
          setCurrentExplanation('pendingTransactions')
        }, 1200)
        return () => clearTimeout(t)
      }
    }

    if (demoStep === 5 && chain.length > 1 && completedSteps.includes(4)) {
      if (!completedSteps.includes(5)) {
        const t = setTimeout(() => {
          setCompletedSteps(prev => [...prev, 5])
          setDemoStep(6)
          setCurrentExplanation('blockConnected')
        }, 1500)
        return () => clearTimeout(t)
      }
    }

    if (demoStep === 7 && !isChainValid && completedSteps.includes(6)) {
      if (!completedSteps.includes(7)) {
        const t = setTimeout(() => {
          setCompletedSteps(prev => [...prev, 7])
          setDemoStep(8)
          setCurrentExplanation('chainInvalid')
        }, 1500)
        return () => clearTimeout(t)
      }
    }
  }, [isDemoMode, demoStep, pendingTransactions.length, chain.length, completedSteps, isChainValid])

  // ── Actions ─────────────────────────────────────────────────────────────────

  const completeStep = useCallback((step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps(prev => [...prev, step])
      if (step >= demoStep) setDemoStep(step + 1)
    }
  }, [completedSteps, demoStep])

  const getStepStatus = useCallback((step: number): DemoStepStatus => {
    if (completedSteps.includes(step)) return 'completed'
    if (step === demoStep) return 'active'
    return 'pending'
  }, [completedSteps, demoStep])

  const selectNode = useCallback((id: NodeId) => {
    setSelectedNodeId(id)
    setSelectedBlock(null)
    setBlockEditState(null)
    setHighlightedBlockIndex(null)
  }, [])

  const syncNode = useCallback((nodeId: NodeId) => {
    setNodes(prev => {
      const reference = prev.find(n => n.status === 'synced') ?? prev[0]
      return prev.map(n =>
        n.id !== nodeId ? n : { ...n, chain: reference.chain, status: 'synced', vote: null }
      )
    })
    setBlockEditState(null)
    setCurrentExplanation('chainValid')
  }, [])

  const createTransaction = useCallback((from: string, to: string, amount: number) => {
    const newTx: Transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      from,
      to,
      amount,
      currency: 'coins',
      timestamp: Date.now(),
    }
    setPendingTransactions(prev => [...prev, newTx])
    setTransactionCount(prev => prev + 1)
    setCurrentExplanation('transactionCreated')

    if (isDemoMode && demoStep === 1) completeStep(1)

    setTimeout(() => setCurrentExplanation('pendingTransactions'), 2000)
  }, [isDemoMode, demoStep, completeStep])

  const createBlockFromPending = useCallback(() => {
    if (pendingTransactions.length === 0) return

    // Snapshot values at callback-creation time
    const capturedPending = pendingTransactions
    const capturedNodeId = selectedNodeId

    setIsAnimating(true)
    setIsHashAnimating(true)
    setCurrentExplanation('networkPropagating')
    setPropagationPhase('propagating')
    setConsensusResult(null)

    // All nodes begin validating
    setNodes(prev => prev.map(n => ({ ...n, status: 'validating' as const, vote: null })))

    if (isDemoMode && demoStep === 3) completeStep(3)

    // ── Phase 1: nodes vote one by one ──────────────────────────────────────
    setTimeout(() => {
      setCurrentExplanation('consensusRunning')
      setPropagationPhase('validating')
    }, 500)

    setTimeout(() => {
      setNodes(prev => prev.map((n, i) => i === 0 ? { ...n, vote: 'approved' as const } : n))
    }, 700)

    setTimeout(() => {
      setNodes(prev => prev.map((n, i) => i === 1 ? { ...n, vote: 'approved' as const } : n))
    }, 1100)

    setTimeout(() => {
      setNodes(prev => prev.map((n, i) => i === 2 ? { ...n, vote: 'approved' as const } : n))
    }, 1500)

    // ── Phase 2: hash animation ends, last vote + consensus ─────────────────
    setTimeout(() => {
      setIsHashAnimating(false)
      setNodes(prev => prev.map((n, i) => i === 3 ? { ...n, vote: 'approved' as const } : n))
      setPropagationPhase('consensus')
      setConsensusResult({ approved: 4, rejected: 0, total: 4, passed: true })
      setCurrentExplanation('consensusReached')

      if (isDemoMode) completeStep(4)
    }, 2000)

    // ── Phase 3: create and replicate block to all nodes ────────────────────
    setTimeout(() => {
      setPropagationPhase('syncing')
      setCurrentExplanation('nodeSyncing')
      setNodes(prev => {
        const sourceNode = prev.find(n => n.id === capturedNodeId) ?? prev[0]
        const prevBlock = sourceNode.chain[sourceNode.chain.length - 1]
        const summary = capturedPending
          .map(tx => {
            const label = CURRENCIES.find(c => c.id === tx.currency)?.label ?? 'Coins'
            return `${tx.from} -> ${tx.to}: ${tx.amount} ${label}`
          })
          .join('; ')
        const newBlock = createBlock(prevBlock, capturedPending, summary)
        setHighlightedBlockIndex(newBlock.index)
        return prev.map(n => ({
          ...n,
          chain: validateChain([...n.chain, newBlock]),
          status: 'syncing' as const,
          vote: null,
        }))
      })
      setPendingTransactions([])
    }, 3500)

    // ── Phase 4: finalize sync ───────────────────────────────────────────────
    setTimeout(() => {
      setNodes(prev => prev.map(n => ({ ...n, status: 'synced' as const })))
      setPropagationPhase('idle')
      setConsensusResult(null)
      setCurrentExplanation('blockConnected')
      setIsAnimating(false)

      setTimeout(() => {
        setCurrentExplanation('chainValid')
        setHighlightedBlockIndex(null)
      }, 2000)
    }, 4500)
  }, [pendingTransactions, selectedNodeId, isDemoMode, demoStep, completeStep])

  const selectBlock = useCallback((block: Block | null) => {
    setSelectedBlock(block)
  }, [])

  const startBlockEdit = useCallback((blockIndex: number) => {
    if (blockIndex === 0) return
    const node = nodes.find(n => n.id === selectedNodeId)
    const block = node?.chain.find(b => b.index === blockIndex)
    if (block) {
      setBlockEditState({
        blockIndex,
        originalHash: block.hash,
        newHash: '',
        isEditing: true,
      })
    }
  }, [nodes, selectedNodeId])

  const cancelBlockEdit = useCallback(() => {
    setBlockEditState(null)
  }, [])

  const alterBlock = useCallback((index: number, newData?: { from?: string; to?: string; amount?: number }) => {
    if (index === 0) return

    setIsAnimating(true)

    const sourceNode = nodes.find(n => n.id === selectedNodeId)
    const originalHash = sourceNode?.chain.find(b => b.index === index)?.hash ?? ''

    setNodes(prev => prev.map(node => {
      if (node.id !== selectedNodeId) return node

      const newChain = node.chain.map((block, i) => {
        if (i !== index) return block

        let modifiedData = block.data
        if (newData && block.transactions.length > 0) {
          const tx = block.transactions[0]
          const from = newData.from ?? tx.from
          const to = newData.to ?? tx.to
          const amount = newData.amount ?? tx.amount
          modifiedData = `${from} -> ${to}: ${amount} [ALTERADO]`
        } else {
          modifiedData = block.data + ' [ALTERADO]'
        }

        const newHash = calculateHash(
          block.index,
          block.timestamp,
          modifiedData,
          block.previousHash,
          block.nonce + 1,
        )

        setBlockEditState({
          blockIndex: index,
          originalHash,
          newHash,
          isEditing: false,
        })

        return { ...block, data: modifiedData, hash: newHash, nonce: block.nonce + 1 }
      })

      return { ...node, chain: validateChain(newChain), status: 'altered' as const }
    }))

    setCurrentExplanation('nodeAltered')

    if (isDemoMode && demoStep === 6) completeStep(6)

    setTimeout(() => {
      setCurrentExplanation('chainInvalid')
      setIsAnimating(false)
    }, 1500)
  }, [nodes, selectedNodeId, isDemoMode, demoStep, completeStep])

  const resetChain = useCallback(() => {
    const genesis = createGenesisBlock()
    setNodes(makeInitialNodes(genesis))
    setSelectedNodeId('alpha')
    setPendingTransactions([])
    setSelectedBlock(null)
    setCurrentExplanation('idle')
    setHighlightedBlockIndex(null)
    setIsDemoMode(false)
    setDemoStep(0)
    setCompletedSteps([])
    setBlockEditState(null)
    setTransactionCount(0)
    setPropagationPhase('idle')
    setConsensusResult(null)
  }, [])

  const setExplanation = useCallback((explanation: ExplanationType) => {
    setCurrentExplanation(explanation)
  }, [])

  const startDemoMode = useCallback(() => {
    resetChain()
    setIsDemoMode(true)
    setDemoStep(1)
    setCompletedSteps([])
    setCurrentExplanation('idle')
  }, [resetChain])

  const stopDemoMode = useCallback(() => {
    setIsDemoMode(false)
    setDemoStep(0)
    setCompletedSteps([])
  }, [])

  const setHighlightedBlock = useCallback((index: number | null) => {
    setHighlightedBlockIndex(index)
  }, [])

  return (
    <BlockchainContext.Provider
      value={{
        chain,
        isChainValid,
        blockCount,
        pendingTransactions,
        selectedBlock,
        currentExplanation,
        isDemoMode,
        demoStep,
        completedSteps,
        isAnimating,
        isHashAnimating,
        highlightedBlockIndex,
        blockEditState,
        transactionCount,
        nodes,
        selectedNodeId,
        propagationPhase,
        consensusResult,
        networkStatus,
        syncedNodeCount,
        createTransaction,
        createBlockFromPending,
        selectBlock,
        alterBlock,
        resetChain,
        setExplanation,
        startDemoMode,
        stopDemoMode,
        setHighlightedBlock,
        completeStep,
        getStepStatus,
        startBlockEdit,
        cancelBlockEdit,
        selectNode,
        syncNode,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  )
}

export function useBlockchain() {
  const context = useContext(BlockchainContext)
  if (context === undefined) {
    throw new Error('useBlockchain must be used within a BlockchainProvider')
  }
  return context
}

export { USERS }
