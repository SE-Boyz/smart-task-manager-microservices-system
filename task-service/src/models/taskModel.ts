import mongoose from 'mongoose'

export type TaskStatus = 'pending' | 'completed'

export interface TaskRecord {
  id: string
  userId: string
  title: string
  status: TaskStatus
  createdAt: string
  updatedAt: string
}

const taskSchema = new mongoose.Schema<TaskRecord>(
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
    },
  },
  {
    versionKey: false,
    collection: 'tasks',
  },
)

taskSchema.index({ userId: 1, createdAt: -1 })

const Task = mongoose.models.Task || mongoose.model<TaskRecord>('Task', taskSchema)

export async function getAllTasks() {
  return Task.find().select('-_id').lean<TaskRecord[]>()
}

export async function findTasksByUser(userId: string) {
  return Task.find({ userId }).select('-_id').lean<TaskRecord[]>()
}

export async function findTaskById(id: string) {
  return Task.findOne({ id }).select('-_id').lean<TaskRecord | null>()
}

export async function createTask(task: TaskRecord) {
  const createdTask = await Task.create(task)
  return createdTask.toObject({ versionKey: false })
}

export async function updateTaskById(id: string, task: TaskRecord) {
  return Task.findOneAndReplace({ id }, task, {
    returnDocument: 'after',
    projection: {
      _id: 0,
    },
    lean: true,
  })
}

export async function deleteTaskById(id: string) {
  await Task.deleteOne({ id })
}
