import bcrypt from 'bcrypt'
import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { publishUserEvent } from '../config/broker.js'
import { getEnv } from '../config/env.js'
import type { AuthenticatedRequest } from '../types/auth.js'
import type { UserEventType } from '../types/userEvent.js'
import { createUser, findUserByEmail, findUserById } from '../models/userModel.js'

async function publishEvent(
  eventType: UserEventType,
  user: { id: string; name: string; email: string },
) {
  const userEvent = {
    eventId: uuidv4(),
    eventType,
    occurredAt: new Date().toISOString(),
    userId: user.id,
    name: user.name,
    email: user.email,
  }

  try {
    await publishUserEvent(userEvent)
  } catch (error) {
    const messageText = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Failed to publish ${eventType} event:`, messageText)
  }
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body as {
      name: string
      email: string
      password: string
    }

    const existingUser = await findUserByEmail(email)

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const userId = uuidv4()

    await createUser({
      id: userId,
      name,
      email,
      password: hashedPassword,
    })

    await publishEvent('user.registered', {
      id: userId,
      name,
      email,
    })

    return res.status(201).json({
      message: 'User registered successfully',
    })
  } catch (error) {
    return next(error)
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { jwtPrivateKey } = getEnv()
    const { email, password } = req.body as {
      email: string
      password: string
    }

    const user = await findUserByEmail(email)

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      jwtPrivateKey,
      {
        algorithm: 'RS256',
        expiresIn: '1h',
      },
    )

    await publishEvent('user.logged_in', {
      id: user.id,
      name: user.name,
      email: user.email,
    })

    return res.status(200).json({
      message: 'Login successful',
      token,
    })
  } catch (error) {
    return next(error)
  }
}

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const authenticatedRequest = req as AuthenticatedRequest
    const user = await findUserById(authenticatedRequest.user.id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).json(user)
  } catch (error) {
    return next(error)
  }
}
