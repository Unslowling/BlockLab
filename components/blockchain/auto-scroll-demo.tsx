"use client"

import { useEffect, useRef } from 'react'
import { useBlockchain, DEMO_STEPS } from '@/lib/contexto-cadena-bloques'
import { Play } from 'lucide-react'

// Which section ID to scroll to when each demo step activates
const STEP_SCROLL_TARGET: Record<number, string> = {
  1: 'sim-forms',       // Create transaction
  3: 'sim-forms',       // Create block button
  4: 'sim-network',     // Watch consensus
  5: 'sim-network',     // Watch replication
  6: 'sim-chain',       // Alter a block
  7: 'sim-network',     // See inconsistency
  8: 'sim-demo-panel',  // Completion screen
}

const HEADER_HEIGHT = 72 // header h-16 (64px) + 8px breathing room
const LG_BREAKPOINT = 1024

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  // Use two rAFs so the scroll runs after any pending layout recalculations
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const top = el.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
    })
  })
}

// ─── Floating "Start Demo" button (mobile only, while demo is inactive) ────────

export function FloatingDemoFAB() {
  const { isDemoMode, startDemoMode } = useBlockchain()

  // Hidden when demo is active (AutoScrollDemo shows the step pill instead)
  if (isDemoMode) return null

  return (
    <div className="fixed bottom-5 right-5 z-50 lg:hidden">
      <button
        onClick={startDemoMode}
        className="flex items-center gap-2 px-4 py-3 rounded-full bg-primary text-primary-foreground shadow-xl font-medium text-sm active:scale-95 transition-transform"
      >
        <Play className="h-4 w-4 fill-current" />
        Iniciar Demo
      </button>
    </div>
  )
}

// ─── Auto-scroll + floating step indicator (mobile only, while demo is active) ─

export function AutoScrollDemo() {
  const { isDemoMode, demoStep } = useBlockchain()
  const prevStepRef = useRef<number>(0)

  useEffect(() => {
    if (!isDemoMode || demoStep === 0) {
      prevStepRef.current = 0
      return
    }
    if (demoStep === prevStepRef.current) return
    prevStepRef.current = demoStep

    if (typeof window === 'undefined' || window.innerWidth >= LG_BREAKPOINT) return

    const target = STEP_SCROLL_TARGET[demoStep]
    if (!target) return

    const timer = setTimeout(() => scrollToSection(target), 400)
    return () => clearTimeout(timer)
  }, [isDemoMode, demoStep])

  if (!isDemoMode || demoStep === 0) return null

  const stepIndex = Math.min(demoStep, DEMO_STEPS.length)
  const currentStep = DEMO_STEPS.find(s => s.step === stepIndex)
  const isComplete = demoStep > DEMO_STEPS.length

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 lg:hidden pointer-events-none">
      <button
        onClick={() => scrollToSection('sim-demo-panel')}
        className="pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground shadow-xl text-sm font-medium active:scale-95 transition-transform whitespace-nowrap"
      >
        {isComplete ? (
          <span>Demo completada — ver resumen</span>
        ) : (
          <>
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
              {stepIndex}
            </span>
            <span>{currentStep?.title}</span>
            <span className="text-white/50 text-xs">· {stepIndex}/{DEMO_STEPS.length}</span>
          </>
        )}
      </button>
    </div>
  )
}
