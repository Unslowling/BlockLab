// Demo mode test — simulates iPhone 12 Pro and walks through all steps
// Checks for horizontal overflow and captures screenshots at each transition.

import { chromium } from 'playwright'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const BASE_URL   = 'http://localhost:8080'
const VIEWPORT   = { width: 390, height: 844 }   // iPhone 12 Pro
const SHOTS_DIR  = 'testing/screenshots'
const MAX_WAIT   = 8000

mkdirSync(SHOTS_DIR, { recursive: true })

let shotIndex = 0
async function shot(page, label) {
  const file = join(SHOTS_DIR, `${String(shotIndex++).padStart(2, '0')}-${label}.png`)
  await page.screenshot({ path: file, fullPage: false })
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
  const scrollW  = await page.evaluate(() => document.documentElement.scrollWidth)
  console.log(`  📸 ${label} | scrollWidth=${scrollW}px | overflow=${overflow ? '❌ YES' : '✅ no'}`)
  if (overflow) {
    const extra = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    console.log(`     ⚠️  Page is ${extra}px wider than viewport!`)
  }
  return overflow
}

async function waitAndShot(page, label, ms = 1000) {
  await page.waitForTimeout(ms)
  return shot(page, label)
}

async function main() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: VIEWPORT,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  })
  const page = await context.newPage()

  // Capture console errors
  page.on('console', m => { if (m.type() === 'error') console.log('  🔴 console error:', m.text()) })

  console.log('\n=== BlockLab Demo Mode Test (iPhone 12 Pro 390×844) ===\n')

  // ── Step 0: Load page ──────────────────────────────────────────────────────
  await page.goto(BASE_URL, { waitUntil: 'networkidle' })
  await waitAndShot(page, '00-initial-load', 1500)

  // ── Step 1: Go to Simulator tab ───────────────────────────────────────────
  await page.getByRole('button', { name: 'Simulador', exact: true }).click()
  await waitAndShot(page, '01-simulator-tab', 800)

  // ── Step 2: Tap "Iniciar Demo" FAB ────────────────────────────────────────
  // Use the fixed floating FAB (not the panel button)
  const fab = page.getByRole('button', { name: 'Iniciar Demo', exact: true })
  await fab.waitFor({ timeout: MAX_WAIT })
  await waitAndShot(page, '02-before-start-demo', 500)
  await fab.click()
  console.log('\n--- Demo started ---')
  await waitAndShot(page, '03-demo-started-step1', 1500)

  // ── Step 3: Create a transaction via React context (bypass Radix UI) ───────
  await page.waitForTimeout(800)
  await shot(page, '04-step1-transaction-form')

  // Trigger createTransaction directly through the window context
  await page.evaluate(() => {
    // Find and fire React's internal event system for the select
    const fromBtn = document.querySelector('[id="from"]')
    if (fromBtn) fromBtn.click()
  })
  await page.waitForTimeout(300)

  // Click the first option in the opened dropdown
  const fromOption = page.getByRole('option').first()
  await fromOption.click({ timeout: 3000 }).catch(() => {})
  await page.waitForTimeout(400)

  // Open "to" select and pick second option
  await page.locator('button[role="combobox"]').nth(1).click({ timeout: 3000 }).catch(() => {})
  await page.waitForTimeout(300)
  const toOption = page.getByRole('option').first()
  await toOption.click({ timeout: 3000 }).catch(() => {})
  await page.waitForTimeout(300)

  // Fill amount
  await page.locator('input[type="number"]').fill('100')
  await page.waitForTimeout(200)
  await shot(page, '05-step1-form-filled')

  // Submit transaction
  await page.getByRole('button', { name: /Agregar Transaccion/i }).click()
  await waitAndShot(page, '06-step1-transaction-created', 1500)
  console.log('  ✔ Transaction created')

  // ── Step 4: Create block ──────────────────────────────────────────────────
  await page.waitForTimeout(1200)
  await shot(page, '07-step3-pending-visible')

  const createBlockBtn = page.getByRole('button', { name: /Crear Bloque con/i })
  await createBlockBtn.waitFor({ timeout: MAX_WAIT })
  await createBlockBtn.click()
  console.log('\n--- Block creation + propagation animation ---')

  // ── Step 5: Watch propagation animation (steps 4-5) ──────────────────────
  // This is the key transition: phase banner + consensus bar appear then disappear
  await waitAndShot(page, '08-propagating-phase', 600)
  await waitAndShot(page, '09-validating-phase', 800)
  await waitAndShot(page, '10-consensus-phase', 800)
  await waitAndShot(page, '11-syncing-phase', 900)
  await waitAndShot(page, '12-step5-block-added', 1000)

  // Critical moment: phase banner + consensus bar disappear → step 5→6 transition
  await waitAndShot(page, '13-step5-to-step6-transition', 1500)
  await waitAndShot(page, '14-step6-chain-visible', 1000)

  // ── Step 6: Measure overflow at the exact network→chain transition ─────────
  console.log('\n--- 🔍 Critical transition scroll width audit ---')
  const scrollWidths = await page.evaluate(() => {
    const elements = {
      'document':        document.documentElement.scrollWidth,
      'body':            document.body.scrollWidth,
      'viewport':        window.innerWidth,
      '#sim-network':    document.getElementById('sim-network')?.scrollWidth ?? 0,
      '#sim-chain':      document.getElementById('sim-chain')?.scrollWidth ?? 0,
      '#sim-demo-panel': document.getElementById('sim-demo-panel')?.scrollWidth ?? 0,
    }
    return elements
  })
  console.log('  Scroll widths:')
  for (const [el, w] of Object.entries(scrollWidths)) {
    const overflow = w > scrollWidths.viewport
    console.log(`    ${el}: ${w}px ${overflow ? '❌ OVERFLOW' : '✅'}`)
  }

  await waitAndShot(page, '15-after-transition', 500)

  // ── Step 7: Alter a block (step 6) — force scroll and click ────────────
  await page.evaluate(() => {
    document.getElementById('sim-chain')?.scrollIntoView({ behavior: 'instant' })
  })
  await page.waitForTimeout(800)
  await shot(page, '16-chain-section')

  // Force click via JS to bypass "outside viewport" issue
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const editBtn = btns.find(b => b.textContent?.includes('Editar Bloque'))
    if (editBtn) editBtn.click()
  })
  await page.waitForTimeout(600)
  await shot(page, '17-dialog-open')

  // Confirm edit via JS too
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const confirmBtn = btns.find(b => b.textContent?.includes('Confirmar'))
    if (confirmBtn) confirmBtn.click()
  })
  await page.waitForTimeout(1000)
  await shot(page, '18-block-altered')
  console.log('\n--- Block altered ---')

  // ── Step 8: Final check ───────────────────────────────────────────────────
  await waitAndShot(page, '19-step7-network-inconsistency', 2000)

  // Deep overflow audit — find exact element causing body 678px
  console.log('\n=== Deep Overflow Audit ===')
  const deepAudit = await page.evaluate(() => {
    const vw = window.innerWidth
    const culprits = []

    document.querySelectorAll('*').forEach(el => {
      const rect = el.getBoundingClientRect()
      const sw = el.scrollWidth
      const ow = el.offsetWidth
      // Check both scrollWidth and actual position
      if (sw > vw + 2 || rect.right > vw + 2) {
        culprits.push({
          tag:    el.tagName,
          id:     el.id || null,
          cls:    (el.className?.toString() || '').slice(0, 80),
          sw,
          ow,
          right:  Math.round(rect.right),
          left:   Math.round(rect.left),
          computedOverflow: window.getComputedStyle(el).overflowX,
          computedWidth:    window.getComputedStyle(el).width,
        })
      }
    })

    return {
      bodyScrollWidth: document.body.scrollWidth,
      docScrollWidth:  document.documentElement.scrollWidth,
      vw,
      culprits: culprits.slice(0, 20),
    }
  })

  console.log(`  body.scrollWidth = ${deepAudit.bodyScrollWidth}px, doc.scrollWidth = ${deepAudit.docScrollWidth}px`)
  if (deepAudit.culprits.length === 0) {
    console.log('  ✅ No elements visually overflow the viewport!')
  } else {
    console.log(`  ❌ ${deepAudit.culprits.length} elements with scrollWidth or right > vw:`)
    deepAudit.culprits.forEach(el => {
      console.log(`    <${el.tag}${el.id ? '#'+el.id : ''}> sw=${el.sw}px ow=${el.ow}px right=${el.right}px overflow-x:${el.computedOverflow} — "${el.cls.slice(0,60)}"`)
    })
  }

  await browser.close()

  // Cleanup test file (keep only from project root)
  console.log(`\n✅ Test complete. Screenshots saved to ./${SHOTS_DIR}/`)
  console.log('   Run from project root: node testing/test-demo.mjs\n')
}

main().catch(err => {
  console.error('Test failed:', err)
  process.exit(1)
})
