// Blockchain types and utilities

// Currency types for educational simulation
export const CURRENCIES = [
  { id: 'coins', label: 'Coins', symbol: 'C' },
  { id: 'tokens', label: 'Tokens', symbol: 'T' },
  { id: 'credits', label: 'Creditos', symbol: 'CR' },
] as const

export type CurrencyType = typeof CURRENCIES[number]['id']

export interface Transaction {
  id: string
  from: string
  to: string
  amount: number
  currency: CurrencyType
  timestamp: number
}

export interface Block {
  index: number
  timestamp: number
  transactions: Transaction[]
  data: string
  previousHash: string
  hash: string
  nonce: number
  isValid: boolean
}

// Simple hash function for educational purposes
export function calculateHash(
  index: number,
  timestamp: number,
  data: string,
  previousHash: string,
  nonce: number
): string {
  const str = `${index}${timestamp}${data}${previousHash}${nonce}`
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  // Convert to hex and pad to simulate SHA-256 style hash
  const hexHash = Math.abs(hash).toString(16).padStart(8, '0')
  return `0x${hexHash}${'0'.repeat(56 - hexHash.length)}${hexHash}`
}

// Create genesis block with fixed timestamp to prevent hydration mismatch
const GENESIS_TIMESTAMP = 1715180400000 // Fixed timestamp for consistent hydration
const GENESIS_HASH = '0x00000000genesis00000000000000000000000000000000000000000000genesis'

export function createGenesisBlock(): Block {
  return {
    index: 0,
    timestamp: GENESIS_TIMESTAMP,
    transactions: [],
    data: 'Bloque Genesis',
    previousHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    hash: GENESIS_HASH,
    nonce: 0,
    isValid: true,
  }
}

// Create a new block
export function createBlock(
  previousBlock: Block,
  transactions: Transaction[],
  data: string
): Block {
  const index = previousBlock.index + 1
  const timestamp = Date.now()
  const nonce = Math.floor(Math.random() * 10000)
  const hash = calculateHash(index, timestamp, data + JSON.stringify(transactions), previousBlock.hash, nonce)
  
  return {
    index,
    timestamp,
    transactions,
    data,
    previousHash: previousBlock.hash,
    hash,
    nonce,
    isValid: true,
  }
}

// Validate a single block
export function validateBlock(block: Block, previousBlock: Block | null): boolean {
  if (block.index === 0) return true
  if (!previousBlock) return false
  
  const expectedHash = calculateHash(
    block.index,
    block.timestamp,
    block.data + JSON.stringify(block.transactions),
    block.previousHash,
    block.nonce
  )
  
  return block.hash === expectedHash && block.previousHash === previousBlock.hash
}

// Validate entire chain
export function validateChain(chain: Block[]): Block[] {
  return chain.map((block, index) => {
    if (index === 0) return { ...block, isValid: true }
    const previousBlock = chain[index - 1]
    const isValid = validateBlock(block, previousBlock) && previousBlock.isValid
    return { ...block, isValid }
  })
}

// Generate random user names for transactions
export const USERS = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry']

// Format timestamp for display
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

// Truncate hash for display
export function truncateHash(hash: string, length: number = 12): string {
  if (hash.length <= length * 2) return hash
  return `${hash.slice(0, length)}...${hash.slice(-length)}`
}
