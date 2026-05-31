"use client"

import { useBlockchain, type NodeId, type VirtualNode } from '@/lib/contexto-cadena-bloques'

// ─── Layout ───────────────────────────────────────────────────────────────────

const W = 340
const H = 300

const POS: Record<NodeId, { x: number; y: number; labelX: number; labelY: number }> = {
  alpha: { x: 170, y:  48, labelX: 170, labelY:  12 },
  beta:  { x:  48, y: 155, labelX:   8, labelY: 155 },
  gamma: { x: 292, y: 155, labelX: 332, labelY: 155 },
  delta: { x: 170, y: 260, labelX: 170, labelY: 292 },
}

const EDGES: Array<[NodeId, NodeId, number]> = [
  ['alpha', 'beta',  0.00],
  ['alpha', 'gamma', 0.20],
  ['alpha', 'delta', 0.40],
  ['beta',  'gamma', 0.60],
  ['beta',  'delta', 0.80],
  ['gamma', 'delta', 1.00],
]

const NODE_RADIUS = 24

// ─── Status → CSS var mapping ─────────────────────────────────────────────────

const STATUS_COLOR: Record<VirtualNode['status'], string> = {
  synced:     'var(--color-success)',
  validating: 'var(--color-warning)',
  syncing:    'var(--color-chart-2)',
  altered:    'var(--color-destructive)',
}

const PHASE_PACKET_COLOR: Record<string, string> = {
  propagating: 'var(--color-chart-2)',
  validating:  'var(--color-warning)',
  consensus:   'var(--color-success)',
  syncing:     'var(--color-primary)',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function edgePath(a: NodeId, b: NodeId) {
  const p1 = POS[a]
  const p2 = POS[b]
  return `M${p1.x},${p1.y} L${p2.x},${p2.y}`
}

function reversePath(a: NodeId, b: NodeId) {
  return edgePath(b, a)
}

// ─── Component ────────────────────────────────────────────────────────────────

export function NetworkGraph() {
  const { nodes, selectedNodeId, propagationPhase, consensusResult } = useBlockchain()

  if (nodes.length === 0) return null

  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n])) as Record<NodeId, VirtualNode>
  const isActive = propagationPhase !== 'idle'
  const packetColor = PHASE_PACKET_COLOR[propagationPhase] ?? 'var(--color-primary)'
  const showReversePackets = propagationPhase === 'syncing' || propagationPhase === 'consensus'

  return (
    <div className="w-full px-2">
      <svg
        viewBox={`-8 0 ${W + 16} ${H}`}
        className="w-full max-w-[400px] mx-auto block"
        role="img"
        aria-label="Red blockchain descentralizada — 4 nodos conectados"
      >
        {/* ── Connection lines ─────────────────────────────────────── */}
        {EDGES.map(([from, to, delay]) => {
          const path = edgePath(from, to)
          const rpath = reversePath(from, to)
          const dur = 1.8 + delay * 0.4

          return (
            <g key={`edge-${from}-${to}`}>
              {/* Static line */}
              <line
                x1={POS[from].x} y1={POS[from].y}
                x2={POS[to].x}   y2={POS[to].y}
                style={{
                  stroke: isActive ? 'var(--color-primary)' : 'var(--color-border)',
                  strokeWidth: isActive ? 1.5 : 1,
                  strokeOpacity: isActive ? 0.55 : 0.45,
                  transition: 'stroke 0.5s, stroke-opacity 0.5s',
                }}
              />

              {/* Forward data packet */}
              {isActive && (
                <circle r={4} style={{ fill: packetColor, opacity: 0.9 }}>
                  <animateMotion
                    dur={`${dur}s`}
                    begin={`${delay}s`}
                    repeatCount="indefinite"
                    path={path}
                  />
                </circle>
              )}

              {/* Reverse packet during sync / consensus */}
              {showReversePackets && (
                <circle r={3} style={{ fill: 'var(--color-success)', opacity: 0.7 }}>
                  <animateMotion
                    dur={`${dur}s`}
                    begin={`${delay + dur / 2}s`}
                    repeatCount="indefinite"
                    path={rpath}
                  />
                </circle>
              )}
            </g>
          )
        })}

        {/* ── Node labels (outside circles) ────────────────────────── */}
        {(Object.keys(POS) as NodeId[]).map((id) => {
          const pos = POS[id]
          const isLeft  = id === 'beta'
          const isRight = id === 'gamma'
          return (
            <text
              key={`label-${id}`}
              x={pos.labelX}
              y={pos.labelY}
              textAnchor={isLeft ? 'start' : isRight ? 'end' : 'middle'}
              dominantBaseline="middle"
              style={{
                fill: 'var(--color-muted-foreground)',
                fontSize: '9px',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: '600',
              }}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </text>
          )
        })}

        {/* ── Nodes ────────────────────────────────────────────────── */}
        {(Object.keys(POS) as NodeId[]).map((id) => {
          const pos   = POS[id]
          const node  = nodeMap[id]
          if (!node) return null

          const color      = STATUS_COLOR[node.status]
          const isSelected = id === selectedNodeId
          const isAltered  = node.status === 'altered'
          const isIdle     = node.status === 'synced'

          return (
            <g key={`node-${id}`}>
              {/* Selected dashed ring */}
              {isSelected && (
                <circle
                  cx={pos.x} cy={pos.y} r={NODE_RADIUS + 8}
                  style={{
                    fill: 'none',
                    stroke: 'var(--color-primary)',
                    strokeWidth: 1.5,
                    strokeDasharray: '5 3',
                    strokeOpacity: 0.7,
                  }}
                />
              )}

              {/* Pulse ring for non-idle nodes */}
              {!isIdle && (
                <circle cx={pos.x} cy={pos.y} r={NODE_RADIUS} style={{ fill: 'none', stroke: color, strokeWidth: 1.5 }}>
                  <animate attributeName="r"               values={`${NODE_RADIUS};${NODE_RADIUS + 12};${NODE_RADIUS}`} dur="2s" repeatCount="indefinite" />
                  <animate attributeName="stroke-opacity"  values="0.5;0;0.5"   dur="2s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Main filled circle */}
              <circle
                cx={pos.x} cy={pos.y} r={NODE_RADIUS}
                style={{
                  fill: color,
                  fillOpacity: isAltered ? 0.18 : 0.12,
                  stroke: color,
                  strokeWidth: isSelected ? 2.5 : 2,
                  transition: 'fill 0.4s, stroke 0.4s',
                }}
              />

              {/* Inner glow circle */}
              <circle
                cx={pos.x} cy={pos.y} r={NODE_RADIUS - 6}
                style={{ fill: color, fillOpacity: 0.06 }}
              />

              {/* Node letter */}
              <text
                x={pos.x} y={pos.y - 3}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fill: color,
                  fontSize: '11px',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: '700',
                }}
              >
                {id[0].toUpperCase()}
              </text>

              {/* Block count */}
              <text
                x={pos.x} y={pos.y + 8}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fill: 'var(--color-muted-foreground)',
                  fontSize: '7px',
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {`${node.chain.length}B`}
              </text>

              {/* Status indicator dot */}
              <circle
                cx={pos.x + NODE_RADIUS - 4}
                cy={pos.y - NODE_RADIUS + 4}
                r={5}
                style={{ fill: color, stroke: 'var(--color-card)', strokeWidth: 1.5 }}
              />

              {/* Vote checkmark inside status dot */}
              {node.vote === 'approved' && (
                <text
                  x={pos.x + NODE_RADIUS - 4}
                  y={pos.y - NODE_RADIUS + 5}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fill: 'var(--color-foreground)',
                    fontSize: '6px',
                    fontWeight: '800',
                  }}
                >
                  ✓
                </text>
              )}
              {node.vote === 'rejected' && (
                <text
                  x={pos.x + NODE_RADIUS - 4}
                  y={pos.y - NODE_RADIUS + 5}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fill: 'var(--color-foreground)',
                    fontSize: '6px',
                    fontWeight: '800',
                  }}
                >
                  ✗
                </text>
              )}

              {/* Mini blockchain blocks below each node */}
              {node.chain.slice(0, Math.min(node.chain.length, 6)).map((block, bi) => {
                // Place blocks in a row centered below the circle
                const totalW = Math.min(node.chain.length, 6) * 7 - 1
                const startX = pos.x - totalW / 2 + bi * 7
                const startY = pos.y + NODE_RADIUS + 6
                return (
                  <rect
                    key={bi}
                    x={startX}
                    y={startY}
                    width={5}
                    height={5}
                    rx={1}
                    style={{
                      fill: block.isValid ? 'var(--color-success)' : 'var(--color-destructive)',
                      fillOpacity: 0.75,
                      transition: 'fill 0.3s',
                    }}
                  />
                )
              })}
            </g>
          )
        })}

        {/* ── Consensus badge ───────────────────────────────────────── */}
        {consensusResult && (
          <g>
            <rect
              x={W / 2 - 52} y={H / 2 - 14}
              width={104} height={28}
              rx={7}
              style={{
                fill: 'var(--color-success)',
                fillOpacity: 0.12,
                stroke: 'var(--color-success)',
                strokeWidth: 1,
                strokeOpacity: 0.5,
              }}
            />
            <text
              x={W / 2} y={H / 2 + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fill: 'var(--color-success)',
                fontSize: '9.5px',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: '700',
              }}
            >
              {`${consensusResult.approved}/${consensusResult.total} aprobaron ✓`}
            </text>
          </g>
        )}
      </svg>
    </div>
  )
}
