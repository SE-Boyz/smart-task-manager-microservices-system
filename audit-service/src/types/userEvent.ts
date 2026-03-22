export type UserEventType = 'user.registered' | 'user.logged_in'

export interface UserEvent {
  eventId: string
  eventType: UserEventType
  occurredAt: string
  userId: string
  name: string
  email: string
}
