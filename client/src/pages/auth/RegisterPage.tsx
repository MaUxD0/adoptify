import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate, Link } from 'react-router-dom'

const HERO_IMG = 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=800&q=80'

const registerSchema = z.object({
  full_name: z.string().min(2, 'Name too short'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'At least 6 characters'),
  role: z.enum(['adopter', 'shelter']),
})
type RegisterForm = z.infer<typeof registerSchema>

const RegisterPage = () => {
  const { register: registerUser, loading, error } = useAuth()
  const navigate = useNavigate()

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'adopter' },
  })

  const selectedRole = watch('role')

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser(data)
      navigate('/login')
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
      <section className="relative h-48 overflow-hidden">
        <img
          src={HERO_IMG}
          alt="Adopt a pet"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-8">
          <h1 className="text-white text-2xl font-bold leading-snug drop-shadow-lg">
            Join <span className="text-pink-300">Adoptify</span>
            <br />
            and change a life today
          </h1>
        </div>
      </section>

      {/* FORM CARD */}
      <div className="bg-white rounded-t-3xl -mt-5 relative z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-5 pt-8 pb-12">
        <h2 className="text-gray-800 text-xl font-black mb-1">Create account</h2>
        <p className="text-gray-400 text-sm mb-6">Tell us a bit about yourself</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-2xl mb-5 flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* ROLE SELECTOR — cards visuales */}
        <div className="mb-5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
            I am a...
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'adopter', emoji: '🐾', label: 'Adopter', sub: 'Looking for a pet' },
              { value: 'shelter', emoji: '🏠', label: 'Shelter', sub: 'I have pets to adopt' },
            ].map(({ value, emoji, label, sub }) => (
              <label
                key={value}
                className={`cursor-pointer rounded-2xl border-2 px-4 py-3 flex flex-col items-center gap-1 transition-all ${
                  selectedRole === value
                    ? 'border-pink-400 bg-pink-50'
                    : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                }`}
              >
                <input
                  {...register('role')}
                  type="radio"
                  value={value}
                  className="sr-only"
                />
                <span className="text-2xl">{emoji}</span>
                <span className={`text-sm font-bold ${selectedRole === value ? 'text-pink-500' : 'text-gray-600'}`}>
                  {label}
                </span>
                <span className="text-xs text-gray-400 text-center">{sub}</span>
              </label>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {[
            { name: 'full_name' as const, label: 'Full name', type: 'text', placeholder: 'Juan Pérez' },
            { name: 'email' as const, label: 'Email', type: 'email', placeholder: 'you@email.com' },
            { name: 'password' as const, label: 'Password', type: 'password', placeholder: '••••••••' },
          ].map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                {label}
              </label>
              <input
                {...register(name)}
                type={type}
                placeholder={placeholder}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition"
              />
              {errors[name] && (
                <p className="text-red-400 text-xs mt-1 ml-1">{errors[name]?.message}</p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 hover:bg-pink-600 active:scale-[0.98] disabled:opacity-50 text-white font-bold text-sm tracking-wide py-4 rounded-full shadow-lg shadow-pink-200 transition-all mt-2"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-gray-300 text-xs">or</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-pink-500 font-bold hover:text-pink-600 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage