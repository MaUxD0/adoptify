import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate, Link } from 'react-router-dom'

const registerSchema = z.object({
  full_name: z.string().min(2, 'Nombre muy corto'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  role: z.enum(['adopter', 'shelter']),
})

type RegisterFormData = z.infer<typeof registerSchema>

const RegisterPage = () => {
  const { register: registerUser, loading, error } = useAuth()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'adopter' },
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data)
      navigate('/login?registered=true')
    } catch {
      // error ya está en context
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-orange-500">
          Crear Cuenta — Adoptify
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre completo</label>
            <input
              {...register('full_name')}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Juan Pérez"
            />
            {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
          </div>

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

          <div>
            <label className="block text-sm font-medium mb-1">Tipo de cuenta</label>
            <select
              {...register('role')}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="adopter">🐾 Adoptante — quiero adoptar mascotas</option>
              <option value="shelter">🏠 Refugio — publico mascotas en adopción</option>
            </select>
            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 transition"
          >
            {loading ? 'Creando cuenta...' : 'Registrarme'}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-orange-500 font-medium hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage