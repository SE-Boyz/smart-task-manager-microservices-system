import mongoose from 'mongoose'
import type { UserEventType } from '../types/userEvent.js'

export interface AuditLogRecord {
  id: string
  userId?: string
  eventType: string
  metadata: Record<string, any>
  createdAt: string
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
      index: true,
    },
    eventType: {
      type: String,
      required: true,
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {},
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
