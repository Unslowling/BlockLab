"use client"

import { useState } from 'react'
import { BlockchainProvider } from '@/lib/contexto-cadena-bloques'
import {
  Header,
  ChainVisualization,
  TransactionForm,
  PendingTransactions,
  ExplanationPanel,
  DemoModePanel,
  HashAnimation,
  EducationalModule,
  NodeNetworkPanel,
  AutoScrollDemo,
  FloatingDemoFAB,
} from '@/components/blockchain'
import { cn } from '@/lib/utilidades'
import { Cpu, GraduationCap } from 'lucide-react'

type ActiveView = 'simulator' | 'education'

export default function BlockchainSimulator() {
  const [activeView, setActiveView] = useState<ActiveView>('education')

  return (
    <BlockchainProvider>
      <HashAnimation />

      <div className="min-h-[100svh] bg-background flex flex-col"
        style={{ minHeight: '-webkit-fill-available' }}>
        <Header />

        <main className="flex-1 container mx-auto px-4 py-4 sm:py-6">
          {/* Tab navigation */}
          <div className="flex gap-1 sm:gap-1.5 p-1 rounded-xl bg-secondary/30 border border-border w-full sm:w-fit mb-4 sm:mb-6">
            <button
              onClick={() => setActiveView('education')}
              className={cn(
                'flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex-1 sm:flex-none',
                activeView === 'education'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              )}
            >
              <GraduationCap className="h-4 w-4" />
              Módulo Educativo
            </button>
            <button
              onClick={() => setActiveView('simulator')}
              className={cn(
                'flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex-1 sm:flex-none',
                activeView === 'simulator'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              )}
            >
              <Cpu className="h-4 w-4" />
              Simulador
            </button>
          </div>

          {/* Simulator view */}
          {activeView === 'simulator' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
              {/* Left Column — Main flow (8 cols) */}
              <div className="lg:col-span-8 space-y-4 lg:space-y-6">
                <ExplanationPanel />

                <div id="sim-forms" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TransactionForm />
                  <PendingTransactions />
                </div>

                <div id="sim-network">
                  <NodeNetworkPanel />
                </div>

                <div id="sim-chain">
                  <ChainVisualization />
                </div>
              </div>

              {/* Right Column — Demo mode (4 cols) */}
              <div id="sim-demo-panel" className="lg:col-span-4">
                <div className="lg:sticky lg:top-16 space-y-4 lg:space-y-6">
                  <DemoModePanel />

                  <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                    <h3 className="font-semibold text-sm mb-3">Guia Rapida</h3>
                    <ol className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">1</span>
                        <span>Crea transacciones entre usuarios</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">2</span>
                        <span>Observa la propagacion y el consenso entre nodos</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">3</span>
                        <span>Selecciona un nodo para ver su cadena local</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">4</span>
                        <span>Altera un bloque y ve como los otros nodos detectan la inconsistencia</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mobile: floating FAB to start demo (inactive state) */}
          {activeView === 'simulator' && <FloatingDemoFAB />}

          {/* Mobile: auto-scroll guide + step indicator (active demo state) */}
          <AutoScrollDemo />

          {/* Educational module view */}
          {activeView === 'education' && (
            <EducationalModule onGoToSimulator={() => setActiveView('simulator')} />
          )}
        </main>

        <footer className="border-t border-border py-6 mt-auto">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <p>BlockLab - Simulador Educativo de Blockchain Descentralizada</p>
              <p className="text-xs">
                Red de 4 nodos virtuales · Consenso simulado · Arquitectura distribuida educativa
              </p>
            </div>
          </div>
        </footer>
      </div>
    </BlockchainProvider>
  )
}
