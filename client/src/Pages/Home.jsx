import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import {
  ApiError,
  clearNotifications,
  createTask,
  deleteNotification,
  deleteTask,
  getNotifications,
  getSummary,
  getTasks,
  updateTask,
} from '../lib/api.js'

const INITIAL_TASK_FORM = {
  title: '',
  status: 'pending',
}

function formatDate(value) {
  if (!value) {
    return 'Not available'
  }

  return new Date(value).toLocaleString()
}

function getErrorMessage(error, fallbackMessage) {
  return error instanceof Error ? error.message : fallbackMessage
}

const Home = () => {
  const navigate = useNavigate()
  const { logout, user, refreshProfile } = useAuth()
  const [tasks, setTasks] = useState([])
  const [notifications, setNotifications] = useState([])
  const [summary, setSummary] = useState(null)
  const [taskForm, setTaskForm] = useState(INITIAL_TASK_FORM)
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pageError, setPageError] = useState('')
  const [formError, setFormError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const completedTasks = useMemo(
    () => tasks.filter((task) => task.status === 'completed'),
    [tasks],
  )

  const pendingTasks = useMemo(
    () => tasks.filter((task) => task.status === 'pending'),
    [tasks],
  )

  const handleUnauthorized = () => {
    logout()
    navigate('/auth', { replace: true })
  }

  const loadNotificationData = async () => {
    try {
      const notificationResponse = await getNotifications()
      setNotifications(notificationResponse.notifications || [])
    } catch (error) {
      setNotifications([])
      setPageError(getErrorMessage(error, 'Unable to load notifications right now.'))
    }
  }

  const loadDashboard = async () => {
    setPageError('')
    setIsLoading(true)

    try {
      await refreshProfile()

      const [taskResult, notificationResult, summaryResult] = await Promise.allSettled([
        getTasks(),
        getNotifications(),
        getSummary(),
      ])

      if (taskResult.status === 'rejected') {
        throw taskResult.reason
      }

      setTasks(taskResult.value.tasks || [])

      if (notificationResult.status === 'fulfilled') {
        setNotifications(notificationResult.value.notifications || [])
      } else {
        setNotifications([])
        setPageError(
          getErrorMessage(notificationResult.reason, 'Unable to load notifications right now.'),
        )
      }

      if (summaryResult.status === 'fulfilled') {
        setSummary(summaryResult.value)
      } else {
        setSummary(null)
        setPageError(getErrorMessage(summaryResult.reason, 'Unable to load summary data.'))
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        handleUnauthorized()
        return
      }

      setPageError(error.message || 'Unable to load dashboard data.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const openCreateDrawer = () => {
    setEditingTaskId(null)
    setTaskForm(INITIAL_TASK_FORM)
    setFormError('')
    setSuccessMessage('')
    setIsDrawerOpen(true)
  }

  const openEditDrawer = (task) => {
    setEditingTaskId(task.id)
    setTaskForm({
      title: task.title,
      status: task.status,
    })
    setFormError('')
    setSuccessMessage('')
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
    setEditingTaskId(null)
    setTaskForm(INITIAL_TASK_FORM)
    setFormError('')
  }

  const handleTaskFormChange = (event) => {
    const { name, value } = event.target
    setTaskForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const refreshTaskData = async () => {
    setPageError('')

    const [taskResult, notificationResult, summaryResult] = await Promise.allSettled([
      getTasks(),
      getNotifications(),
      getSummary(),
    ])

    if (taskResult.status === 'rejected') {
      throw taskResult.reason
    }

    setTasks(taskResult.value.tasks || [])

    if (notificationResult.status === 'fulfilled') {
      setNotifications(notificationResult.value.notifications || [])
    } else {
      setNotifications([])
      setPageError(getErrorMessage(notificationResult.reason, 'Unable to refresh notifications.'))
    }

    if (summaryResult.status === 'fulfilled') {
      setSummary(summaryResult.value)
    } else {
      setSummary(null)
      setPageError(getErrorMessage(summaryResult.reason, 'Unable to refresh summary data.'))
    }
  }

  const handleTaskSubmit = async (event) => {
    event.preventDefault()
    setFormError('')
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
      if (editingTaskId) {
        const response = await updateTask(editingTaskId, taskForm)
        setSuccessMessage(response.message)
      } else {
        const response = await createTask(taskForm)
        setSuccessMessage(response.message)
      }

      await refreshTaskData()
      closeDrawer()
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        handleUnauthorized()
        return
      }

      setFormError(error.message || 'Unable to save the task.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteTask = async (taskId) => {
    setPageError('')
    setSuccessMessage('')

    try {
      const response = await deleteTask(taskId)
      setSuccessMessage(response.message)
      await refreshTaskData()
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        handleUnauthorized()
        return
      }

      setPageError(error.message || 'Unable to delete the task.')
    }
  }

  const handleDeleteNotification = async (notificationId) => {
    setPageError('')
    setSuccessMessage('')

    try {
      const response = await deleteNotification(notificationId)
      setSuccessMessage(response.message)
      await loadNotificationData()
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        handleUnauthorized()
        return
      }

      setPageError(error.message || 'Unable to delete the notification.')
    }
  }

  const handleClearNotifications = async () => {
    setPageError('')
    setSuccessMessage('')

    try {
      const response = await clearNotifications()
      setSuccessMessage(response.message)
      await loadNotificationData()
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        handleUnauthorized()
        return
      }

      setPageError(error.message || 'Unable to clear notifications.')
    }
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-bold">
              Smart Task Manager System
            </p>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Welcome{user?.name ? `, ${user.name}` : ''}.
            </h1>
            <p className="text-sm text-secondary">
              Your frontend is now using the API Gateway at
              {' '}
              <span className="font-semibold text-on-surface">http://localhost:5000</span>
              {' '}
              for every feature.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm">
              <span className="font-semibold">Signed in as:</span>
              {' '}
              {user?.email || 'Loading...'}
            </div>
            <button
              className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20"
              onClick={openCreateDrawer}
              type="button"
            >
              New Task
            </button>
            <button
              className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700"
              onClick={handleUnauthorized}
              type="button"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {pageError && (
          <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {pageError}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
            {successMessage}
          </div>
        )}

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <article className="rounded-[2rem] bg-white p-5 shadow-sm border border-slate-200/80">
            <p className="text-xs uppercase tracking-[0.25em] text-secondary font-bold">Profile</p>
            <h2 className="mt-3 text-lg font-bold">{user?.name || 'Loading profile...'}</h2>
            <p className="mt-1 text-sm text-secondary">{user?.email || 'Fetching user data'}</p>
          </article>
          <article className="rounded-[2rem] bg-white p-5 shadow-sm border border-slate-200/80">
            <p className="text-xs uppercase tracking-[0.25em] text-secondary font-bold">Total Tasks</p>
            <p className="mt-3 text-3xl font-black">{summary?.total ?? tasks.length}</p>
          </article>
          <article className="rounded-[2rem] bg-white p-5 shadow-sm border border-slate-200/80">
            <p className="text-xs uppercase tracking-[0.25em] text-secondary font-bold">Completed</p>
            <p className="mt-3 text-3xl font-black text-emerald-600">
              {summary?.completed ?? completedTasks.length}
            </p>
          </article>
          <article className="rounded-[2rem] bg-white p-5 shadow-sm border border-slate-200/80">
            <p className="text-xs uppercase tracking-[0.25em] text-secondary font-bold">Pending</p>
            <p className="mt-3 text-3xl font-black text-amber-600">
              {summary?.pending ?? pendingTasks.length}
            </p>
          </article>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-8">
          <div className="space-y-8">
            <section className="rounded-[2rem] bg-white p-6 shadow-sm border border-slate-200/80">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-black tracking-tight">Your Tasks</h2>
                  <p className="text-sm text-secondary">
                    Create, update, and delete tasks through the gateway.
                  </p>
                </div>
                <button
                  className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
                  onClick={loadDashboard}
                  type="button"
                >
                  Refresh
                </button>
              </div>

              {isLoading ? (
                <div className="rounded-3xl bg-slate-50 px-5 py-8 text-center text-secondary">
                  Loading tasks...
                </div>
              ) : tasks.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 px-5 py-8 text-center text-secondary">
                  No tasks yet. Create your first task to test the gateway flow.
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <article
                      className="rounded-[1.75rem] border border-slate-200 bg-slate-50/70 p-5"
                      key={task.id}
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-bold text-on-surface">{task.title}</h3>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${task.status === 'completed'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-amber-100 text-amber-700'
                                }`}
                            >
                              {task.status}
                            </span>
                          </div>
                          <p className="mt-3 text-sm text-secondary">
                            Created:
                            {' '}
                            {formatDate(task.createdAt)}
                          </p>
                          <p className="mt-1 text-sm text-secondary">
                            Updated:
                            {' '}
                            {formatDate(task.updatedAt)}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <button
                            className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-300"
                            onClick={() => openEditDrawer(task)}
                            type="button"
                          >
                            Edit
                          </button>
                          <button
                            className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                            onClick={() => handleDeleteTask(task.id)}
                            type="button"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-[2rem] bg-white p-6 shadow-sm border border-slate-200/80">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-black tracking-tight">Report Summary</h2>
                  <p className="text-sm text-secondary">
                    Live summary loaded from `GET /reports/summary`.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-[1.75rem] bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-secondary font-bold">Total</p>
                  <p className="mt-3 text-3xl font-black">{summary?.total ?? 0}</p>
                </div>
                <div className="rounded-[1.75rem] bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-secondary font-bold">Completed</p>
                  <p className="mt-3 text-3xl font-black text-emerald-600">{summary?.completed ?? 0}</p>
                </div>
                <div className="rounded-[1.75rem] bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-secondary font-bold">Pending</p>
                  <p className="mt-3 text-3xl font-black text-amber-600">{summary?.pending ?? 0}</p>
                </div>
              </div>

              <p className="mt-4 text-sm text-secondary">
                Generated at:
                {' '}
                {summary?.generatedAt ? formatDate(summary.generatedAt) : 'Not available'}
              </p>
            </section>
          </div>

          <aside className="space-y-8">
            <section className="rounded-[2rem] bg-white p-6 shadow-sm border border-slate-200/80">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black tracking-tight">Notifications</h2>
                  <p className="mt-1 text-sm text-secondary">
                    Loaded from `GET /notifications` through the gateway.
                  </p>
                </div>
                <button
                  className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
                  disabled={notifications.length === 0}
                  onClick={handleClearNotifications}
                  type="button"
                >
                  Clear all
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {notifications.length === 0 ? (
                  <div className="rounded-[1.75rem] border border-dashed border-slate-300 px-5 py-8 text-center text-secondary">
                    Notifications will appear here when tasks are created, updated, or deleted.
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <article className="rounded-[1.75rem] bg-slate-50 p-4" key={notification.id}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-on-surface">{notification.message}</p>
                          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-secondary">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>
                        <button
                          className="rounded-2xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700"
                          onClick={() => handleDeleteNotification(notification.id)}
                          type="button"
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-[2rem] bg-white p-6 shadow-sm border border-slate-200/80">
              <h2 className="text-xl font-black tracking-tight">Quick Stats</h2>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span>Pending tasks</span>
                  <span className="font-bold">{pendingTasks.length}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span>Completed tasks</span>
                  <span className="font-bold">{completedTasks.length}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span>Notification logs</span>
                  <span className="font-bold">{notifications.length}</span>
                </div>
              </div>
            </section>
          </aside>
        </section>
      </main>

      <div
        className={`fixed inset-0 z-30 bg-slate-950/25 backdrop-blur-sm transition ${isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      >
        <div className="flex min-h-full justify-end">
          <div
            className={`h-full w-full max-w-md bg-white p-8 shadow-2xl transition-transform ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
              }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-secondary font-bold">
                  {editingTaskId ? 'Update Task' : 'Create Task'}
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight">
                  {editingTaskId ? 'Edit your task' : 'Add a new task'}
                </h2>
              </div>
              <button
                className="rounded-2xl bg-slate-100 p-3 text-slate-700"
                onClick={closeDrawer}
                type="button"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleTaskSubmit}>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-on-surface" htmlFor="title">
                  Task title
                </label>
                <input
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-primary"
                  id="title"
                  name="title"
                  placeholder="Finish assignment"
                  value={taskForm.title}
                  onChange={handleTaskFormChange}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-on-surface" htmlFor="status">
                  Status
                </label>
                <select
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-primary"
                  id="status"
                  name="status"
                  value={taskForm.status}
                  onChange={handleTaskFormChange}
                >
                  <option value="pending">pending</option>
                  <option value="completed">completed</option>
                </select>
              </div>

              {formError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {formError}
                </div>
              )}

              <div className="pt-4 space-y-3">
                <button
                  className="w-full rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting
                    ? 'Saving...'
                    : editingTaskId
                      ? 'Update Task'
                      : 'Create Task'}
                </button>
                <button
                  className="w-full rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700"
                  onClick={closeDrawer}
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
