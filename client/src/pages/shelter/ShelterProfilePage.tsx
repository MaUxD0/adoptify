import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { usersService } from '../../services/users.service'
import { supabase } from '../../api/supabase'

const HERO_IMG = 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&q=80'

const ShelterProfilePage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [success, setSuccess] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url ?? '')
  const [formData, setFormData] = useState({
    full_name: user?.full_name ?? '',
    phone: '',
    city: '',
    bio: '',
    shelter_id: '',
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await usersService.getMyProfile()
        setFormData({
          full_name: profile.full_name || '',
          phone: profile.phone || '',
          city: profile.city || '',
          bio: profile.bio || '',
          shelter_id: profile.shelter_id || '',
        })
        if (profile.avatar_url) setAvatarUrl(profile.avatar_url)
      } catch (err) {
        console.error('Error fetching profile:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const initials = user?.full_name
    ?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) ?? '?'

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploadingPhoto(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `avatars/${user.id}.${ext}`
      const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
      if (error) throw error
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      const url = `${data.publicUrl}?t=${Date.now()}`
      await usersService.updateMyProfile({ avatar_url: url } as never)
      setAvatarUrl(url)
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await usersService.updateMyProfile(formData)
      setSuccess(true)
      setEditing(false)
      setTimeout(() => setSuccess(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-28">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
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
          <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
            Centro
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-500 border border-red-200 hover:border-red-300 px-3 py-1.5 rounded-full transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
          </svg>
          Cerrar sesión
        </button>
      </header>

      {/* HERO */}
      <section className="relative h-44 overflow-hidden">
        <img src={HERO_IMG} alt="Profile hero" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/60" />
      </section>

      {/* MAIN CARD */}
      <div className="bg-white rounded-t-3xl -mt-5 relative z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-5 pt-5 pb-8">

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-2xl mb-5 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            ¡Perfil actualizado con éxito!
          </div>
        )}

        {/* AVATAR + ROLE */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-white shadow-md bg-blue-100 flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-black text-blue-500">{initials}</span>
              )}
              {uploadingPhoto && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                </div>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center shadow-md transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </div>
          <div>
            <h2 className="text-gray-800 text-lg font-black leading-tight">{formData.full_name || 'Nombre del Centro'}</h2>
            <p className="text-gray-400 text-xs mt-0.5">{user.email}</p>
            <span className="inline-block mt-1.5 text-xs font-bold px-3 py-0.5 rounded-full bg-blue-100 text-blue-600">
              🏠 Centro de Adopción
            </span>
          </div>
        </div>

        <div className="h-px bg-gray-100 mb-5" />

        {!editing ? (
          <>
            <div className="space-y-4 mb-6">
              {[
                { icon: '📞', label: 'Teléfono', value: formData.phone || 'No especificado' },
                { icon: '📍', label: 'Ciudad', value: formData.city || 'No especificado' },
                { icon: '🆔', label: 'ID del Centro', value: formData.shelter_id || 'No especificado' },
                { icon: '📝', label: 'Descripción', value: formData.bio || 'Sin descripción' },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex gap-3 items-start">
                  <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-base flex-shrink-0">
                    {icon}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</p>
                    <p className="text-sm text-gray-700 mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setEditing(true)}
              className="w-full border-2 border-blue-400 text-blue-500 font-bold text-sm py-4 rounded-full hover:bg-blue-50 active:scale-[0.98] transition-all"
            >
              Editar Perfil del Centro
            </button>
          </>
        ) : (
          <div className="space-y-4">
            <Field label="Nombre del Centro">
              <input
                type="text"
                value={formData.full_name}
                onChange={e => setFormData(p => ({ ...p, full_name: e.target.value }))}
                placeholder="Nombre oficial"
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition"
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Teléfono">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+57 300..."
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition"
                />
              </Field>
              <Field label="Ciudad">
                <input
                  type="text"
                  value={formData.city}
                  onChange={e => setFormData(p => ({ ...p, city: e.target.value }))}
                  placeholder="Ej: Cali"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition"
                />
              </Field>
            </div>

            <Field label="ID del Centro (Uso interno)">
              <input
                type="text"
                value={formData.shelter_id}
                onChange={e => setFormData(p => ({ ...p, shelter_id: e.target.value }))}
                placeholder="ID de Supabase"
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition"
              />
            </Field>

            <Field label="Descripción del Centro">
              <textarea
                value={formData.bio}
                onChange={e => setFormData(p => ({ ...p, bio: e.target.value }))}
                placeholder="Cuéntanos sobre tu labor..."
                rows={4}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition resize-none"
              />
            </Field>

            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-blue-500 hover:bg-blue-600 active:scale-[0.98] disabled:opacity-50 text-white font-bold text-sm py-4 rounded-full shadow-lg shadow-blue-200 transition-all"
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="w-full border border-gray-200 text-gray-400 font-medium text-sm py-3 rounded-full hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 px-4 pb-safe">
        <div className="max-w-md mx-auto flex items-center justify-around py-2">
          <NavBtn icon="dashboard" label="Dashboard" onClick={() => navigate("/shelter/dashboard")} />
          <NavBtn icon="requests" label="Solicitudes" onClick={() => navigate("/shelter/requests")} />
          <NavBtn icon="add" label="Publicar" onClick={() => navigate("/shelter/create-pet")} />
          <NavBtn icon="profile" label="Perfil" active onClick={() => navigate("/shelter/profile")} />
        </div>
      </nav>
    </div>
  )
}

const Field = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div>
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
      {label}
    </label>
    {children}
  </div>
)

const NavBtn = ({ icon, label, active, onClick }: { icon: string; label: string; active?: boolean; onClick: () => void }) => {
  const icons: Record<string, React.ReactElement> = {
    dashboard: (
      <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
    requests: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    add: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
    profile: (
      <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  };

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
        active ? "text-blue-500" : "text-gray-400 hover:text-gray-600"
      }`}
    >
      {icons[icon]}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
};

export default ShelterProfilePage
