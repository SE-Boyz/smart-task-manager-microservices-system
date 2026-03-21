import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { loginUser, registerUser } from '../lib/api.js'

const INITIAL_FORM = {
  name: '',
  email: '',
  password: '',
}

const Auth = () => {
  const navigate = useNavigate()
  const { isAuthenticated, login } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState(INITIAL_FORM)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const toggleAuthMode = (event) => {
    event.preventDefault()
    setIsLogin((current) => !current)
    setErrorMessage('')
    setSuccessMessage('')
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
      if (isLogin) {
        const response = await loginUser({
          email: form.email.trim(),
          password: form.password,
        })

        await login(response.token)
        navigate('/', { replace: true })
        return
      }

      const response = await registerUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      })

      setSuccessMessage(response.message)
      setIsLogin(true)
      setForm((current) => ({
        ...current,
        password: '',
      }))
    } catch (error) {
      setErrorMessage(error.message || 'Unable to complete your request.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-[#f0f2f5] min-h-screen flex items-center justify-center p-4 md:p-8 selection:bg-primary/20">
      <main className="w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px]">
        <section className="md:w-[45%] auth-mesh p-10 md:p-16 flex flex-col justify-between relative overflow-hidden text-white m-4 rounded-[2rem]">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-12">
              <span
                className="material-symbols-outlined text-white text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                checklist
              </span>
            </div>
            <div className="space-y-6">
              <p className="text-sm font-semibold tracking-widest uppercase opacity-80">
                Gateway connected
              </p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                Manage tasks, notifications, and reports from one place.
              </h2>
              <p className="text-sm md:text-base max-w-md text-white/80 leading-relaxed">
                This client talks only to the API Gateway at
                {' '}
                <span className="font-semibold">http://localhost:5000</span>
                {' '}
                for auth, task management, notifications, and summary data.
              </p>
            </div>
          </div>
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-5%] left-[-5%] w-48 h-48 bg-blue-950/20 rounded-full blur-3xl"></div>
        </section>

        <section className="flex-1 p-10 md:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10 text-center md:text-left">
              <div className="inline-flex items-center justify-center md:justify-start gap-2 mb-6">
                <span
                  className="material-symbols-outlined text-primary text-2xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  checklist
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-on-surface mb-3 tracking-tight">
                {isLogin ? 'Welcome back' : 'Create an account'}
              </h1>
              <p className="text-secondary text-sm leading-relaxed">
                Sign in to manage your tasks through the gateway, or create a new account to get started.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-on-surface" htmlFor="name">
                    Full name
                  </label>
                  <input
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-3.5 px-4 text-on-surface placeholder:text-outline/60 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-bold text-on-surface" htmlFor="email">
                  Your email
                </label>
                <input
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-3.5 px-4 text-on-surface placeholder:text-outline/60 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                  id="email"
                  name="email"
                  placeholder="john@example.com"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-bold text-on-surface" htmlFor="password">
                    Password
                  </label>
                  {isLogin && (
                    <span className="text-xs font-semibold text-primary">JWT session</span>
                  )}
                </div>
                <input
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-3.5 px-4 text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter at least 6 characters"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>

              {errorMessage && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {successMessage}
                </div>
              )}

              <button
                className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 hover:bg-primary-dim active:scale-[0.98] transition-all duration-200 text-sm disabled:opacity-60"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? 'Please wait...' : isLogin ? 'Sign In' : 'Get Started'}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-secondary text-sm font-medium">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <button className="text-primary font-bold hover:underline ml-1" onClick={toggleAuthMode}>
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Auth
