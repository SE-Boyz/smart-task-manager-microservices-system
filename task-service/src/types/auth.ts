import type { Request } from 'express'

export interface AuthTokenPayload {
  id: string
  name?: string
  email?: string
  role?: string
  serviceName?: string
}

export interface AuthenticatedRequest extends Request {
  user: AuthTokenPayload
}
