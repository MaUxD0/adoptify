import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { usersService } from '../../services/users.service'

const ProfilePage = () => {
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: user?.full_name ?? '',
    phone: '',
    city: '',
    bio: '',
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

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

  if (!user) return <div className="p-8">Cargando perfil...</div>

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>

      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          ✅ Perfil actualizado correctamente
        </div>
      )}

      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-2xl">
            {user.full_name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <p className="font-semibold text-lg">{user.full_name}</p>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full capitalize">
              {user.role === 'adopter' ? '🐾 Adoptante' : '🏠 Refugio'}
            </span>
          </div>
        </div>

        {editing ? (
          <div className="space-y-3">
            <input
              value={formData.full_name}
              onChange={e => setFormData(p => ({ ...p, full_name: e.target.value }))}
              placeholder="Nombre completo"
              className="w-full border rounded-lg px-3 py-2"
            />
            <input
              value={formData.phone}
              onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
              placeholder="Teléfono"
              className="w-full border rounded-lg px-3 py-2"
            />
            <input
              value={formData.city}
              onChange={e => setFormData(p => ({ ...p, city: e.target.value }))}
              placeholder="Ciudad"
              className="w-full border rounded-lg px-3 py-2"
            />
            <textarea
              value={formData.bio}
              onChange={e => setFormData(p => ({ ...p, bio: e.target.value }))}
              placeholder="Sobre mí..."
              className="w-full border rounded-lg px-3 py-2 h-24 resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="border px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="text-orange-500 border border-orange-500 px-4 py-2 rounded-lg hover:bg-orange-50"
          >
            Editar perfil
          </button>
        )}
      </div>
    </div>
  )
}

export default ProfilePage