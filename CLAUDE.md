# Carcaj — App de puntuación de tiro con arco

App móvil para que un arquero registre sus tiradas de competición y (más adelante) vea estadísticas y gráficas. Proyecto también usado para aprender React Native.

## Dominio

- Una **competición** tiene **10 rondas**.
- Cada **ronda** tiene **3 flechas**.
- Cada **flecha** puntúa con un valor numérico genérico, o **"M"** (miss/fallo, cuenta como 0 en estadísticas). No se modelan reglas de dianas reales (tipo WA) por ahora.
- Futuro: varias rondas compartidas por varios arqueros (uno apunta por todos); variantes de competición aún sin definir.

## Alcance actual (MVP)

Registrar una competición completa (10x3) de un solo arquero, con persistencia real vía API propia. Sin estadísticas/gráficas ni multi-arquero todavía.

## Estructura del repo

**Monorepo** con npm workspaces:
- `apps/mobile` — app Expo/React Native (ver `apps/mobile/CLAUDE.md`)
- `apps/api` — backend Node + Express + Prisma (ver `apps/api/CLAUDE.md`)

`npm install` desde la raíz instala las dependencias de ambos workspaces. Scripts de conveniencia en la raíz: `npm run mobile`, `npm run api`.

## Stack técnico

**Frontend**
- Expo (managed workflow) + expo-router (file-based routing) + TypeScript
- ⚠️ Antes de escribir código, consultar los docs versionados de Expo v57 (ver `AGENTS.md`)

**Backend**
- Node + Express
- Prisma + SQLite
- Auth multi-usuario con JWT (cada arquero tiene su cuenta desde el MVP)

**Hosting**
- Railway, servicio apuntando al subdirectorio `apps/api`
- SQLite sobre volumen persistente de Railway (los datos sobreviven entre deploys)

## Modelo de datos (borrador)

- `User`: id, nombre, email, password (hash)
- `Competition`: id, userId, fecha, nombre/descripción
- `Round`: id, competitionId, número de ronda (1-10)
- `Arrow`: id, roundId, número de flecha (1-3), puntuación (string: número o `"M"`)

Multi-arquero por ronda (futuro): tabla intermedia tipo `RoundParticipant` entre `Round` y `User`.

## Fases

1. MVP: competición completa, un arquero, API real, desplegado en Railway.
2. Estadísticas y gráficas.
3. Múltiples arqueros por ronda.
4. Variantes de competición.

## Referencia

Idea y decisiones desarrolladas en Obsidian: `Personal/Proyectos/Carcaj - App tiro con arco.md`.
