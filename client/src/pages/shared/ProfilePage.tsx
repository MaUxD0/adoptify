import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { usersService } from '../../services/users.service'
import { supabase } from '../../api/supabase'

const HERO_IMG = 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&q=80'

const ProfilePage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [success, setSuccess] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url ?? '')
  const [formData, setFormData] = useState({
    full_name: user?.full_name ?? '',
    phone: '',
    city: '',
    bio: '',
  })

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
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-pink-500 border-t-transparent" />
    </div>
  )

  return (
    <div className="min-h-screen bg-white font-sans pb-28">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 px-5 py-3 flex items-center justify-between">
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
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-500 border border-red-200 hover:border-red-300 px-3 py-1.5 rounded-full transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
          </svg>
          Sign out
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
            Profile updated successfully!
          </div>
        )}

        {/* AVATAR + ROLE */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-white shadow-md bg-pink-100 flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-black text-pink-500">{initials}</span>
              )}
              {uploadingPhoto && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                </div>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-pink-500 hover:bg-pink-600 rounded-full flex items-center justify-center shadow-md transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </div>
          <div>
            <h2 className="text-gray-800 text-lg font-black leading-tight">{user.full_name}</h2>
            <p className="text-gray-400 text-xs mt-0.5">{user.email}</p>
            <span className={`inline-block mt-1.5 text-xs font-bold px-3 py-0.5 rounded-full ${
              user.role === 'SHELTER'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-pink-100 text-pink-600'
            }`}>
              {user.role === 'SHELTER' ? '🏠 Shelter' : '🐾 Adopter'}
            </span>
          </div>
        </div>

        <div className="h-px bg-gray-100 mb-5" />

        {!editing ? (
          <>
            <div className="space-y-4 mb-6">
              {[
                { icon: '📞', label: 'Phone', value: formData.phone || 'Not specified' },
                { icon: '📍', label: 'City', value: formData.city || 'Not specified' },
                { icon: '📝', label: 'About me', value: formData.bio || 'No description yet' },
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
              className="w-full border-2 border-pink-400 text-pink-500 font-bold text-sm py-4 rounded-full hover:bg-pink-50 active:scale-[0.98] transition-all"
            >
              Edit Profile
            </button>
          </>
        ) : (
          <div className="space-y-4">
            {[
              { key: 'full_name' as const, label: 'Full name', type: 'text', placeholder: 'Your name' },
              { key: 'phone' as const, label: 'Phone', type: 'tel', placeholder: '+57 300 000 0000' },
              { key: 'city' as const, label: 'City', type: 'text', placeholder: 'Cali, Colombia' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  {label}
                </label>
                <input
                  type={type}
                  value={formData[key]}
                  onChange={e => setFormData(p => ({ ...p, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition"
                />
              </div>
            ))}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                About me
              </label>
              <textarea
                value={formData.bio}
                onChange={e => setFormData(p => ({ ...p, bio: e.target.value }))}
                placeholder="Tell us about yourself..."
                rows={3}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition resize-none"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-pink-500 hover:bg-pink-600 active:scale-[0.98] disabled:opacity-50 text-white font-bold text-sm py-4 rounded-full shadow-lg shadow-pink-200 transition-all"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="w-full border border-gray-200 text-gray-400 font-medium text-sm py-3 rounded-full hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 px-4 pb-safe">
        <div className="max-w-md mx-auto flex items-center justify-around py-2 relative">
          <div className="absolute left-1/2 -translate-x-1/2 -top-6">
            <button className="w-12 h-12 bg-pink-500 hover:bg-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-pink-300 transition-all active:scale-95">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
          </div>
          {[
            { icon: 'home', label: 'Home', action: () => navigate('/home') },
            { icon: 'search', label: 'Search', action: () => {} },
          ].map(({ icon, label, action }) => (
            <button key={label} onClick={action} className="flex flex-col items-center gap-0.5 px-2 py-1 text-gray-400 hover:text-gray-600 transition-colors">
              {icon === 'home'
                ? <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
                : <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>}
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
          <div className="w-12" />
          {[
            { icon: 'heart', label: 'Applications', action: () => navigate('/applications') },
            { icon: 'user', label: 'Profile', action: () => navigate('/profile'), active: true },
          ].map(({ icon, label, action, active }) => (
            <button key={label} onClick={action} className={`flex flex-col items-center gap-0.5 px-2 py-1 transition-colors ${active ? 'text-pink-500' : 'text-gray-400 hover:text-gray-600'}`}>
              {icon === 'heart'
                ? <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
                : <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>}
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default ProfilePage