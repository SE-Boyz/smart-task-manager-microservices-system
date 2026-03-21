export type TaskEventType = 'task.created' | 'task.updated' | 'task.deleted'

export interface TaskEvent {
  eventId: string
  eventType: TaskEventType
  occurredAt: string
  taskId: string
  userId: string
  title: string
  status: 'pending' | 'completed'
}
