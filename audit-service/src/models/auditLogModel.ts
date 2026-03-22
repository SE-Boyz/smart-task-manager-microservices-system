import mongoose from 'mongoose'
import type { UserEventType } from '../types/userEvent.js'

export interface AuditLogRecord {
  id: string
  userId: string
  email: string
  name: string
  eventType: UserEventType
  createdAt: string
}

export interface AuditSummaryRecord {
  total: number
  registered: number
  loggedIn: number
  generatedAt: string
}

const auditLogSchema = new mongoose.Schema<AuditLogRecord>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: ['user.registered', 'user.logged_in'],
      index: true,
    },
    createdAt: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    versionKey: false,
    collection: 'audit_logs',
  },
)

auditLogSchema.index({ userId: 1, createdAt: -1 })

const AuditLog =
  mongoose.models.AuditLog || mongoose.model<AuditLogRecord>('AuditLog', auditLogSchema)

export async function createAuditLog(auditLog: AuditLogRecord) {
  const createdAuditLog = await AuditLog.create(auditLog)
  return createdAuditLog.toObject({ versionKey: false })
}

export async function getAuditLogsByUser(userId: string) {
  return AuditLog.find({ userId })
    .sort({ createdAt: -1 })
    .select('-_id')
    .lean<AuditLogRecord[]>()
}

export async function getAuditSummaryByUser(userId: string): Promise<AuditSummaryRecord> {
  const [total, registered, loggedIn] = await Promise.all([
    AuditLog.countDocuments({ userId }),
    AuditLog.countDocuments({ userId, eventType: 'user.registered' }),
    AuditLog.countDocuments({ userId, eventType: 'user.logged_in' }),
  ])

  return {
    total,
    registered,
    loggedIn,
    generatedAt: new Date().toISOString(),
  }
}
