import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'
import { asyncHandler } from '../lib/async-handler.js'

export const authRouter = Router()

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

authRouter.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email and password are required' })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  try {
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
    })
    res.status(201).json({ token: signToken(user.id) })
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Email already in use' })
    }
    throw err
  }
}))

authRouter.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  const valid = user && (await bcrypt.compare(password, user.passwordHash))

  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  res.json({ token: signToken(user.id) })
}))
