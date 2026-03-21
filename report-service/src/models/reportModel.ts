import mongoose from 'mongoose'
import type { TaskEvent } from '../types/taskEvent.js'

export interface ProjectedTaskRecord {
  taskId: string
  userId: string
  title: string
  status: 'pending' | 'completed'
  createdAt: string
  updatedAt: string
}

export interface ReportSummaryRecord {
  total: number
  completed: number
  pending: number
  generatedAt: string
}

const projectedTaskSchema = new mongoose.Schema<ProjectedTaskRecord>(
  {
    taskId: {
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
    title: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'completed'],
    },
    createdAt: {
      type: String,
      required: true,
    },
    updatedAt: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    versionKey: false,
    collection: 'projected_tasks',
  },
)

projectedTaskSchema.index({ status: 1 })

const ProjectedTask =
  mongoose.models.ProjectedTask ||
  mongoose.model<ProjectedTaskRecord>('ProjectedTask', projectedTaskSchema)

function createProjectedTaskRecord(taskEvent: TaskEvent): ProjectedTaskRecord {
  return {
    taskId: taskEvent.taskId,
    userId: taskEvent.userId,
    title: taskEvent.title,
    status: taskEvent.status,
    createdAt: taskEvent.occurredAt,
    updatedAt: taskEvent.occurredAt,
  }
}

export async function applyTaskEventToProjection(taskEvent: TaskEvent) {
  if (taskEvent.eventType === 'task.deleted') {
    await ProjectedTask.deleteOne({ taskId: taskEvent.taskId })
    return
  }

  const existingTask = await ProjectedTask.findOne({ taskId: taskEvent.taskId })
    .select('-_id')
    .lean<ProjectedTaskRecord | null>()

  const projectedTask = createProjectedTaskRecord(taskEvent)

  await ProjectedTask.findOneAndUpdate(
    { taskId: taskEvent.taskId },
    {
      ...projectedTask,
      createdAt: existingTask?.createdAt || projectedTask.createdAt,
    },
    {
      upsert: true,
      returnDocument: 'after',
      setDefaultsOnInsert: true,
    },
  )
}

export async function getSummarySnapshot(): Promise<ReportSummaryRecord> {
  const [total, completed, pending] = await Promise.all([
    ProjectedTask.countDocuments(),
    ProjectedTask.countDocuments({ status: 'completed' }),
    ProjectedTask.countDocuments({ status: 'pending' }),
  ])

  return {
    total,
    completed,
    pending,
    generatedAt: new Date().toISOString(),
  }
}
