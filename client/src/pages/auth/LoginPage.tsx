import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate, Link } from 'react-router-dom'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

const LoginPage = () => {
  const { login, loading, error } = useAuth()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data)
      navigate('/dashboard')
    } catch {
      // error ya está en context
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-orange-500">
          Iniciar Sesión — Adoptify
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              {...register('email')}
              type="email"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="tu@email.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <input
              {...register('password')}
              type="password"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 transition"
          >
            {loading ? 'Cargando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-orange-500 font-medium hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage