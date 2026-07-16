import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { asyncHandler } from '../lib/async-handler.js'

export const competitionsRouter = Router()

const ROUNDS_PER_COMPETITION = 10
const ARROWS_PER_ROUND = 3

competitionsRouter.post('/', asyncHandler(async (req, res) => {
  const { name, date } = req.body

  const competition = await prisma.competition.create({
    data: {
      userId: req.userId,
      name,
      ...(date ? { date: new Date(date) } : {}),
      rounds: {
        create: Array.from({ length: ROUNDS_PER_COMPETITION }, (_, i) => ({
          number: i + 1,
          arrows: {
            create: Array.from({ length: ARROWS_PER_ROUND }, (_, j) => ({ number: j + 1 })),
          },
        })),
      },
    },
    include: {
      rounds: {
        orderBy: { number: 'asc' },
        include: { arrows: { orderBy: { number: 'asc' } } },
      },
    },
  })

  res.status(201).json(competition)
}))

competitionsRouter.get('/', asyncHandler(async (req, res) => {
  const competitions = await prisma.competition.findMany({
    where: { userId: req.userId },
    select: { id: true, name: true, date: true },
    orderBy: { date: 'desc' },
  })

  res.json(competitions)
}))

async function findOwnedCompetition(id, userId) {
  return prisma.competition.findFirst({
    where: { id, userId },
    include: {
      rounds: {
        orderBy: { number: 'asc' },
        include: { arrows: { orderBy: { number: 'asc' } } },
      },
    },
  })
}

competitionsRouter.get('/:id', asyncHandler(async (req, res) => {
  const competition = await findOwnedCompetition(req.params.id, req.userId)
  if (!competition) return res.status(404).json({ error: 'Competition not found' })
  res.json(competition)
}))

competitionsRouter.patch('/:id/rounds/:roundNumber/arrows/:arrowNumber', asyncHandler(async (req, res) => {
  const { score } = req.body
  if (typeof score !== 'string' || score.length === 0) {
    return res.status(400).json({ error: 'score must be a non-empty string' })
  }

  const roundNumber = Number(req.params.roundNumber)
  const arrowNumber = Number(req.params.arrowNumber)

  const competition = await prisma.competition.findFirst({
    where: { id: req.params.id, userId: req.userId },
  })
  if (!competition) return res.status(404).json({ error: 'Competition not found' })

  const round = await prisma.round.findFirst({
    where: { competitionId: competition.id, number: roundNumber },
  })
  if (!round) return res.status(404).json({ error: 'Round not found' })

  const arrow = await prisma.arrow.findFirst({
    where: { roundId: round.id, number: arrowNumber },
  })
  if (!arrow) return res.status(404).json({ error: 'Arrow not found' })

  const updated = await prisma.arrow.update({
    where: { id: arrow.id },
    data: { score },
  })

  res.json(updated)
}))

competitionsRouter.delete('/:id', asyncHandler(async (req, res) => {
  const competition = await prisma.competition.findFirst({
    where: { id: req.params.id, userId: req.userId },
  })
  if (!competition) return res.status(404).json({ error: 'Competition not found' })

  await prisma.competition.delete({ where: { id: competition.id } })
  res.status(204).end()
}))
