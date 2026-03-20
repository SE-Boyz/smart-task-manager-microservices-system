import bcrypt from 'bcrypt'
import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import type { AuthenticatedRequest } from '../types/auth.js'
import { createUser, findUserByEmail, findUserById } from '../models/userModel.js'

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

    await createUser({
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
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
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' },
    )

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
