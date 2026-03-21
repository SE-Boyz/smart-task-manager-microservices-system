import type { NextFunction, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { publishTaskEvent } from '../config/broker.js'
import type { AuthenticatedRequest } from '../types/auth.js'
import type { TaskEvent, TaskEventType } from '../types/taskEvent.js'
import {
  createTask as createTaskRecord,
  deleteTaskById,
  findTaskById,
  findTasksByUser,
  getAllTasks,
  type TaskRecord,
  type TaskStatus,
  updateTaskById,
} from '../models/taskModel.js'

async function publishEvent(eventType: TaskEventType, task: TaskRecord) {
  const taskEvent: TaskEvent = {
    eventId: uuidv4(),
    eventType,
    occurredAt: new Date().toISOString(),
    taskId: task.id,
    userId: task.userId,
    title: task.title,
    status: task.status,
  }

  try {
    await publishTaskEvent(taskEvent)
  } catch (error: unknown) {
    const messageText = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Failed to publish ${eventType} event:`, messageText)
  }
}

export async function getTasks(req: Request, res: Response, next: NextFunction) {
  try {
    const authenticatedRequest = req as AuthenticatedRequest

    if (authenticatedRequest.user.role === 'service') {
      const tasks = await getAllTasks()
      return res.status(200).json({ tasks })
    }

    const userTasks = await findTasksByUser(authenticatedRequest.user.id)
    return res.status(200).json({ tasks: userTasks })
  } catch (error) {
    return next(error)
  }
}

export async function createTask(req: Request, res: Response, next: NextFunction) {
  try {
    const authenticatedRequest = req as AuthenticatedRequest
    const { title, status } = req.body as { title: string; status: TaskStatus }
    const now = new Date().toISOString()

    const newTask: TaskRecord = {
      id: uuidv4(),
      userId: authenticatedRequest.user.id,
      title,
      status,
      createdAt: now,
      updatedAt: now,
    }

    await createTaskRecord(newTask)
    await publishEvent('task.created', newTask)

    return res.status(201).json({
      message: 'Task created successfully',
      task: newTask,
    })
  } catch (error) {
    return next(error)
  }
}

export async function updateTask(req: Request, res: Response, next: NextFunction) {
  try {
    const authenticatedRequest = req as AuthenticatedRequest
    const id = String(req.params.id)
    const { title, status } = req.body as { title: string; status: TaskStatus }
    const existingTask = await findTaskById(id)

    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found' })
    }

    if (
      authenticatedRequest.user.role !== 'service' &&
      existingTask.userId !== authenticatedRequest.user.id
    ) {
      return res.status(403).json({ message: 'You are not allowed to update this task' })
    }

    const updatedTask: TaskRecord = {
      ...existingTask,
      title,
      status,
      updatedAt: new Date().toISOString(),
    }

    await updateTaskById(id, updatedTask)
    await publishEvent('task.updated', updatedTask)

    return res.status(200).json({
      message: 'Task updated successfully',
      task: updatedTask,
    })
  } catch (error) {
    return next(error)
  }
}

export async function deleteTask(req: Request, res: Response, next: NextFunction) {
  try {
    const authenticatedRequest = req as AuthenticatedRequest
    const id = String(req.params.id)
    const existingTask = await findTaskById(id)

    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found' })
    }

    if (
      authenticatedRequest.user.role !== 'service' &&
      existingTask.userId !== authenticatedRequest.user.id
    ) {
      return res.status(403).json({ message: 'You are not allowed to delete this task' })
    }

    await deleteTaskById(id)
    await publishEvent('task.deleted', existingTask)

    return res.status(200).json({
      message: 'Task deleted successfully',
    })
  } catch (error) {
    return next(error)
  }
}
