import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate, Link } from 'react-router-dom'

const HERO_IMG = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})
type LoginForm = z.infer<typeof loginSchema>

const LoginPage = () => {
  const { login, loading, error } = useAuth()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data)
      navigate('/')
    } catch { /* error en context */ }
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 px-5 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1">
          <span className="text-2xl font-black tracking-tight">
            <span className="text-red-500">A</span>
            <span className="text-yellow-400">D</span>
            <span className="text-green-500">O</span>
            <span className="text-pink-500">P</span>
            <span className="text-blue-500">T</span>
            <span className="text-pink-500">I</span>
            <span className="text-orange-400">F</span>
            <span className="text-purple-500">Y</span>
          </span>
        </Link>
      </header>

      {/* HERO */}
      <section className="relative h-56 overflow-hidden">
        <img
          src={HERO_IMG}
          alt="Pets waiting for a home"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/40 to-black/70" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-8">
          <h1 className="text-white text-2xl font-bold leading-snug drop-shadow-lg">
            Welcome back!
            <br />
            <span className="text-pink-300">Your furry friend</span> is waiting.
          </h1>
        </div>
      </section>

      {/* FORM CARD */}
      <div className="bg-white rounded-t-3xl -mt-5 relative z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-5 pt-8 pb-12">
        <h2 className="text-gray-800 text-xl font-black mb-1">Sign In</h2>
        <p className="text-gray-400 text-sm mb-6">Enter your credentials to continue</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-2xl mb-5 flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              placeholder="you@email.com"
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1 ml-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
              Password
            </label>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition"
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1 ml-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 hover:bg-pink-600 active:scale-[0.98] disabled:opacity-50 text-white font-bold text-sm tracking-wide py-4 rounded-full shadow-lg shadow-pink-200 transition-all mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-gray-300 text-xs">or</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <p className="text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-pink-500 font-bold hover:text-pink-600 transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage