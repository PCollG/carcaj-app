# API (backend)

Node + Express + Prisma + SQLite. Sin build step (JavaScript plano con ESM), pensado para arrancar simple.

## Comandos

- `npm run dev` — arranca el servidor con reload (`node --watch`)
- `npm run prisma:generate` — regenera el cliente Prisma tras tocar `prisma/schema.prisma`
- `npm run prisma:migrate` — crea/aplica una migración en desarrollo

## Configuración

Copiar `.env.example` a `.env` y ajustar `DATABASE_URL`, `JWT_SECRET`, `PORT`. `.env` no se commitea.

## Modelo de datos

Ver `prisma/schema.prisma`: `User`, `Competition`, `Round`, `Arrow`. Detalle del dominio y las decisiones de producto en el `CLAUDE.md` de la raíz.

## Despliegue

Railway, servicio apuntando a este subdirectorio (`apps/api`), con volumen persistente montado sobre el archivo SQLite (`DATABASE_URL`).
