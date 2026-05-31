# Guía de Flujo Git — Proyecto BlockChain
### Juan Manuel (Persona 1) · Alisson (Persona 2)

---

## Contenido
1. [Configuración inicial](#1-configuración-inicial)
2. [Estructura de ramas](#2-estructura-de-ramas)
3. [.gitignore](#3-gitignore)
4. [Flujo Juan Manuel — Persona 1](#4-flujo-juan-manuel--persona-1)
5. [Flujo Alisson — Persona 2](#5-flujo-alisson--persona-2)
6. [Pull Requests en GitHub](#6-pull-requests-en-github)
7. [Reglas de commit](#7-reglas-de-commit)
8. [Mejoras de responsividad — Commits adicionales](#8-mejoras-de-responsividad--commits-adicionales)

---

## 1. Configuración inicial

> **Solo una persona hace esto (Juan Manuel).** Alisson solo clona al final.

### 1.1 Crear repositorio en GitHub
1. Ir a [github.com](https://github.com) → **New repository**
2. Nombre: `BlockChain`
3. Visibilidad: **Private** (recomendado) o Public
4. **NO** marcar "Add README" ni ".gitignore" — se configura a mano
5. Copiar la URL del repo: `https://github.com/usuario/BlockChain.git`

### 1.2 Inicializar el repo local (Juan Manuel)

```bash
git init
git remote add origin https://github.com/usuario/BlockChain.git
```

### 1.3 Subir .gitignore y GIT_WORKFLOW.md como base

```bash
git add .gitignore GIT_WORKFLOW.md
git commit -m "chore: configuración inicial del repositorio"
git branch -M main
git push -u origin main
```

### 1.4 Alisson clona el repositorio

```bash
git clone https://github.com/usuario/BlockChain.git
cd BlockChain
```

---

## 2. Estructura de ramas

```
main
├── rama-juan-manuel            ← Juan Manuel: código base del proyecto
├── rama-alisson                ← Alisson: código base del proyecto
├── fix/responsive-juan-manuel  ← Juan Manuel: mejoras de responsividad
└── fix/responsive-alisson      ← Alisson: mejoras de responsividad
```

- **`main`** → rama principal, solo recibe cambios a través de Pull Requests en GitHub.
- **`rama-juan-manuel`** → Juan Manuel sube su mitad del proyecto (código base).
- **`rama-alisson`** → Alisson sube su mitad del proyecto (código base).
- **`fix/responsive-juan-manuel`** → Juan Manuel sube las mejoras responsivas de sus archivos.
- **`fix/responsive-alisson`** → Alisson sube las mejoras responsivas de sus archivos.

---

## 3. .gitignore

Crear el archivo `.gitignore` en la raíz del proyecto con el siguiente contenido:

```gitignore
# Dependencias
node_modules/
.pnp
.pnp.js

# Build de Next.js
.next/
out/
/build
/dist

# Variables de entorno y claves privadas
.env
.env.local
.env.development
.env.test
.env.production
*.key
*.pem
secrets.json

# Wallets y credenciales blockchain
keystore/
wallet.json
mnemonic.txt
private_keys.txt

# Cobertura de tests
coverage/
.nyc_output

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Sistema operativo
.DS_Store
Thumbs.db
desktop.ini

# IDEs y editores
.vscode/
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# TypeScript compilado
*.tsbuildinfo
next-env.d.ts

# Archivos temporales
*.tmp
*.temp
.cache/
```

---

## 4. Flujo Juan Manuel — Persona 1

> Juan Manuel sube: configuración del proyecto, lógica core de la blockchain, layout y componentes principales de blockchain.

### 4.1 Crear su rama

```bash
git checkout main
git pull origin main
git checkout -b rama-juan-manuel
```

### 4.2 Commits — uno por archivo

**Archivos de configuración del proyecto:**

```bash
git add package.json
git commit -m "chore: configuración de dependencias del proyecto"
```

```bash
git add tsconfig.json
git commit -m "chore: configuración de TypeScript"
```

```bash
git add next.config.mjs
git commit -m "chore: configuración de Next.js"
```

```bash
git add postcss.config.mjs
git commit -m "chore: configuración de PostCSS"
```

```bash
git add components.json
git commit -m "chore: configuración de componentes shadcn/ui"
```

**App base:**

```bash
git add app/layout.tsx
git commit -m "feat: layout principal de la aplicación"
```

```bash
git add app/estilos-globales.css
git commit -m "feat: estilos globales de la aplicación"
```

**Lógica core de la blockchain (`lib/`):**

```bash
git add lib/cadena-bloques.ts
git commit -m "feat: lógica principal de la cadena de bloques"
```

```bash
git add lib/contexto-cadena-bloques.tsx
git commit -m "feat: contexto global del estado de la cadena de bloques"
```

```bash
git add lib/utilidades.ts
git commit -m "feat: funciones utilitarias del proyecto"
```

**Componentes blockchain principales (`components/blockchain/`):**

```bash
git add components/blockchain/index.ts
git commit -m "feat: exportaciones del módulo blockchain"
```

```bash
git add components/blockchain/visualizacion-cadena.tsx
git commit -m "feat: componente visualización de la cadena de bloques"
```

```bash
git add components/blockchain/tarjeta-bloque.tsx
git commit -m "feat: componente tarjeta de bloque individual"
```

```bash
git add components/blockchain/formulario-transaccion.tsx
git commit -m "feat: componente formulario para crear transacciones"
```

```bash
git add components/blockchain/transacciones-pendientes.tsx
git commit -m "feat: componente lista de transacciones pendientes"
```

### 4.3 Push de su rama

```bash
git push -u origin rama-juan-manuel
```

---

## 5. Flujo Alisson — Persona 2

> Alisson sube: página principal, componentes UI reutilizables y componentes visuales/educativos de blockchain.

### 5.1 Crear su rama

```bash
git checkout main
git pull origin main
git checkout -b rama-alisson
```

### 5.2 Commits — uno por archivo

**Página principal:**

```bash
git add app/page.tsx
git commit -m "feat: página principal de la aplicación"
```

**Componentes UI reutilizables (`components/ui/`):**

```bash
git add components/ui/boton.tsx
git commit -m "feat: componente botón"
```

```bash
git add components/ui/tarjeta.tsx
git commit -m "feat: componente tarjeta UI"
```

```bash
git add components/ui/entrada.tsx
git commit -m "feat: componente campo de entrada"
```

```bash
git add components/ui/etiqueta.tsx
git commit -m "feat: componente etiqueta"
```

```bash
git add components/ui/dialogo.tsx
git commit -m "feat: componente diálogo modal"
```

```bash
git add components/ui/insignia.tsx
git commit -m "feat: componente insignia"
```

```bash
git add components/ui/progreso.tsx
git commit -m "feat: componente barra de progreso"
```

```bash
git add components/ui/selector.tsx
git commit -m "feat: componente selector desplegable"
```

```bash
git add components/ui/area-desplazamiento.tsx
git commit -m "feat: componente área de desplazamiento"
```

```bash
git add components/ui/informacion-herramienta.tsx
git commit -m "feat: componente tooltip de información"
```

**Componentes visuales y educativos de blockchain (`components/blockchain/`):**

```bash
git add components/blockchain/encabezado.tsx
git commit -m "feat: componente encabezado de la aplicación"
```

```bash
git add components/blockchain/animacion-hash.tsx
git commit -m "feat: componente animación visual del hash"
```

```bash
git add components/blockchain/grafico-red.tsx
git commit -m "feat: componente gráfico de la red blockchain"
```

```bash
git add components/blockchain/panel-red-nodos.tsx
git commit -m "feat: componente panel de nodos de la red"
```

```bash
git add components/blockchain/panel-explicacion.tsx
git commit -m "feat: componente panel de explicación"
```

```bash
git add components/blockchain/modulo-educativo.tsx
git commit -m "feat: componente módulo educativo"
```

```bash
git add components/blockchain/modo-demostracion.tsx
git commit -m "feat: componente modo demostración interactivo"
```

### 5.3 Push de su rama

```bash
git push -u origin rama-alisson
```

---

## 6. Pull Requests en GitHub

> Una vez que cada persona terminó y subió su rama, **NO se hace merge por terminal**.  
> La integración a `main` se hace creando un **Pull Request (PR) en GitHub**.

### 6.1 Crear PR de rama-juan-manuel → main

1. Ir al repositorio en GitHub.
2. GitHub mostrará un aviso: _"rama-juan-manuel had recent pushes"_ → clic en **Compare & pull request**.
3. Verificar que la base sea `main` y el compare sea `rama-juan-manuel`.
4. Título: `feat: configuración, lógica core y componentes blockchain principales`.
5. Clic en **Create pull request**.
6. Alisson revisa el PR y aprueba.
7. Clic en **Merge pull request** → **Confirm merge**.

### 6.2 Crear PR de rama-alisson → main

1. Ir al repositorio en GitHub.
2. Clic en **Compare & pull request** junto a `rama-alisson`.
3. Verificar que la base sea `main` y el compare sea `rama-alisson`.
4. Título: `feat: página principal, componentes UI y visuales blockchain`.
5. Clic en **Create pull request**.
6. Juan Manuel revisa el PR y aprueba.
7. Clic en **Merge pull request** → **Confirm merge**.

### 6.3 Verificar el estado final (opcional)

```bash
git checkout main
git pull origin main
git log --oneline --graph --all
```

---

## 8. Mejoras de responsividad — Commits adicionales

> Cambios para adaptar la aplicación a dispositivos móviles (iPhone 12 Pro / iOS Safari).  
> Cada persona crea su propia rama de fix, hace sus commits y abre un Pull Request a `main`.

```
main
├── rama-juan-manuel               (commits originales)
├── rama-alisson                   (commits originales)
├── fix/responsive-juan-manuel     ← nueva rama Juan Manuel
└── fix/responsive-alisson         ← nueva rama Alisson
```

---

### 8.1 Juan Manuel — fix/responsive-juan-manuel

**Crear la rama desde main:**

```bash
git checkout main
git pull origin main
git checkout -b fix/responsive-juan-manuel
```

**Estilos globales — iOS fixes:**

```bash
git add app/estilos-globales.css
git commit -m "fix: overflow-x clip y touch-action para compatibilidad iOS Safari"
```

**Visualización de cadena — scroll horizontal nativo:**

```bash
git add components/blockchain/visualizacion-cadena.tsx
git commit -m "fix: reemplazar ScrollArea por overflow-x-auto nativo para scroll de bloques en móvil"
```

**Tarjeta de bloque — diálogo responsive:**

```bash
git add components/blockchain/tarjeta-bloque.tsx
git commit -m "fix: ajustar max-width del diálogo editar bloque para pantallas pequeñas"
```

**Formulario de transacción — preview responsive:**

```bash
git add components/blockchain/formulario-transaccion.tsx
git commit -m "fix: flex-wrap en preview de transacción para móvil"
```

**Testing — script Playwright:**

```bash
git add testing/test-demo.mjs testing/screenshots/
git commit -m "chore: script Playwright de test del modo demo con capturas iPhone 12 Pro"
```

**Subir la rama y abrir PR:**

```bash
git push -u origin fix/responsive-juan-manuel
```

> En GitHub: **Compare & pull request** → base: `main` ← compare: `fix/responsive-juan-manuel`  
> Título: `fix: mejoras de responsividad — archivos Juan Manuel`  
> Alisson revisa y aprueba → **Merge pull request**

---

### 8.2 Alisson — fix/responsive-alisson

**Crear la rama desde main:**

```bash
git checkout main
git pull origin main
git checkout -b fix/responsive-alisson
```

**Componente Card base — fix overflow iOS:**

```bash
git add components/ui/tarjeta.tsx
git commit -m "fix: eliminar @container/card-header, añadir min-w-0 y overflow-hidden al Card"
```

**Nuevo componente — auto-scroll y FAB demo:**

```bash
git add components/blockchain/auto-scroll-demo.tsx
git commit -m "feat: componente AutoScrollDemo y FloatingDemoFAB para guía en modo demo móvil"
```

```bash
git add components/blockchain/index.ts
git commit -m "feat: exportar AutoScrollDemo y FloatingDemoFAB desde el módulo blockchain"
```

**Página principal — layout responsive completo:**

```bash
git add app/page.tsx
git commit -m "fix: grid-cols-1 como base, section IDs para auto-scroll, FAB demo en simulador móvil"
```

**Panel de nodos — animaciones suaves y padding móvil:**

```bash
git add components/blockchain/panel-red-nodos.tsx
git commit -m "fix: animación CSS grid en banner/consenso, padding responsive, grid-cols-1 para nodos"
```

**Panel de explicación — padding responsive:**

```bash
git add components/blockchain/panel-explicacion.tsx
git commit -m "style: padding responsive en panel de explicación para móvil"
```

**Modo demostración — fix conflicto de scroll:**

```bash
git add components/blockchain/modo-demostracion.tsx
git commit -m "fix: reemplazar scrollIntoView por container.scrollTo para evitar conflicto de scroll en demo"
```

**Módulo educativo — grids responsive:**

```bash
git add components/blockchain/modulo-educativo.tsx
git commit -m "fix: añadir grid-cols-1 base a todos los grids del módulo educativo"
```

**Gráfico de red — fix overflow SVG iOS:**

```bash
git add components/blockchain/grafico-red.tsx
git commit -m "fix: eliminar overflow visible del SVG para evitar expansión de página en iOS"
```

**Subir la rama y abrir PR:**

```bash
git push -u origin fix/responsive-alisson
```

> En GitHub: **Compare & pull request** → base: `main` ← compare: `fix/responsive-alisson`  
> Título: `fix: mejoras de responsividad — archivos Alisson`  
> Juan Manuel revisa y aprueba → **Merge pull request**

---

### 8.3 Verificar el estado final

```bash
git checkout main
git pull origin main
git log --oneline --graph --all
```

---

## 7. Reglas de commit

| Prefijo | Cuándo usarlo |
|---------|---------------|
| `feat:` | Nueva funcionalidad o archivo nuevo |
| `fix:` | Corrección de bug |
| `chore:` | Configuración, dependencias, archivos de proyecto |
| `style:` | Cambios de formato o estilos visuales |
| `refactor:` | Reestructura de código sin cambiar funcionalidad |
| `docs:` | Cambios en documentación |

---

## Distribución de archivos

| Archivo | Responsable |
|---------|-------------|
| `package.json` | Juan Manuel |
| `tsconfig.json` | Juan Manuel |
| `next.config.mjs` | Juan Manuel |
| `postcss.config.mjs` | Juan Manuel |
| `components.json` | Juan Manuel |
| `app/layout.tsx` | Juan Manuel |
| `app/estilos-globales.css` | Juan Manuel |
| `lib/cadena-bloques.ts` | Juan Manuel |
| `lib/contexto-cadena-bloques.tsx` | Juan Manuel |
| `lib/utilidades.ts` | Juan Manuel |
| `components/blockchain/index.ts` | Juan Manuel |
| `components/blockchain/visualizacion-cadena.tsx` | Juan Manuel |
| `components/blockchain/tarjeta-bloque.tsx` | Juan Manuel |
| `components/blockchain/formulario-transaccion.tsx` | Juan Manuel |
| `components/blockchain/transacciones-pendientes.tsx` | Juan Manuel |
| `app/page.tsx` | Alisson |
| `components/ui/boton.tsx` | Alisson |
| `components/ui/tarjeta.tsx` | Alisson |
| `components/ui/entrada.tsx` | Alisson |
| `components/ui/etiqueta.tsx` | Alisson |
| `components/ui/dialogo.tsx` | Alisson |
| `components/ui/insignia.tsx` | Alisson |
| `components/ui/progreso.tsx` | Alisson |
| `components/ui/selector.tsx` | Alisson |
| `components/ui/area-desplazamiento.tsx` | Alisson |
| `components/ui/informacion-herramienta.tsx` | Alisson |
| `components/blockchain/encabezado.tsx` | Alisson |
| `components/blockchain/animacion-hash.tsx` | Alisson |
| `components/blockchain/grafico-red.tsx` | Alisson |
| `components/blockchain/panel-red-nodos.tsx` | Alisson |
| `components/blockchain/panel-explicacion.tsx` | Alisson |
| `components/blockchain/modulo-educativo.tsx` | Alisson |
| `components/blockchain/modo-demostracion.tsx` | Alisson |
| `components/blockchain/auto-scroll-demo.tsx` | Alisson |
| `testing/test-demo.mjs` | Juan Manuel |
| `testing/screenshots/` | Juan Manuel |

---

*Proyecto BlockChain — Juan Manuel & Alisson*
