import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePets } from "../../hooks/usePets";
import { useAuth } from "../../hooks/useAuth";
import { PetsService } from "../../services/pets.service";
import type { Pet } from "../../types/pet.types";


const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80";

const ShelterPetCard = ({
  pet,
  onDelete,
}: {
  pet: Pet;
  onDelete: (id: string) => void;
}) => {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar a ${pet.name}? Esta acción no se puede deshacer.`)) return;
    setDeleting(true);
    try {
      await PetsService.deletePet(pet.id);
      onDelete(pet.id);
    } catch {
      alert("Error al eliminar la mascota");
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="relative">
        <img
          src={pet.image_url || FALLBACK_IMG}
          alt={pet.name}
          className="w-full h-36 object-cover"
        />
        <span
          className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
            pet.status === "available"
              ? "bg-green-100 text-green-700"
              : pet.status === "adopted"
              ? "bg-blue-100 text-blue-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {pet.status}
        </span>
      </div>

      <div className="p-3 flex-1 flex flex-col gap-1">
        <h3 className="font-black text-gray-900 text-sm">{pet.name}</h3>
        <p className="text-gray-400 text-xs">
          {pet.breed || pet.species} · {pet.age}y
        </p>
      </div>

      <div className="px-3 pb-3 flex gap-2">
        <button
          onClick={() => navigate(`/shelter/edit-pet/${pet.id}`)}
          className="flex-1 border border-pink-300 text-pink-500 hover:bg-pink-50 text-xs font-bold py-1.5 rounded-full transition-colors"
        >
          Editar
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex-1 border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400 text-xs font-bold py-1.5 rounded-full transition-colors disabled:opacity-50"
        >
          {deleting ? "..." : "Eliminar"}
        </button>
      </div>
    </div>
  );
};

const ShelterDashboardPage = () => {
  const { user } = useAuth();
  const { pets, loading } = usePets();
  const navigate = useNavigate();
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  const myPets = pets.filter(
    (p) =>
      !user?.shelter_id ||
      (p as Pet & { shelter_id?: string }).shelter_id === user.shelter_id
  );
  const visiblePets = myPets.filter((p) => !deletedIds.includes(p.id));

  const handleDelete = (id: string) => setDeletedIds((prev) => [...prev, id]);

  const stats = {
    total: visiblePets.length,
    available: visiblePets.filter((p) => p.status === "available").length,
    adopted: visiblePets.filter((p) => p.status === "adopted").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-28">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tight">
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
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
      </header>

      <div className="px-5 pt-5">
        {/* BIENVENIDA */}
        <div className="mb-5">
          <h1 className="text-gray-900 text-xl font-black leading-tight">
            Panel del Centro 🏠
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Gestiona tus publicaciones y solicitudes
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-3 text-center border border-gray-100 shadow-sm">
            <p className="text-2xl font-black text-pink-500">{stats.total}</p>
            <p className="text-gray-400 text-xs mt-0.5">Publicadas</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center border border-gray-100 shadow-sm">
            <p className="text-2xl font-black text-green-500">{stats.available}</p>
            <p className="text-gray-400 text-xs mt-0.5">Disponibles</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center border border-gray-100 shadow-sm">
            <p className="text-2xl font-black text-blue-500">{stats.adopted}</p>
            <p className="text-gray-400 text-xs mt-0.5">Adoptadas</p>
          </div>
        </div>

        {/* ACCESO SOLICITUDES */}
        <Link
          to="/shelter/requests"
          className="flex items-center justify-between bg-pink-500 text-white rounded-2xl px-4 py-3 mb-6 shadow-md shadow-pink-200 hover:bg-pink-600 transition-colors active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-sm">Solicitudes de adopción</p>
              <p className="text-pink-100 text-xs">Ver y gestionar peticiones</p>
            </div>
          </div>
          <svg className="w-5 h-5 text-pink-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        {/* MIS MASCOTAS */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-900 font-bold text-base">Mis mascotas</h2>
          <span className="text-gray-400 text-xs">{visiblePets.length} publicaciones</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-100 animate-pulse h-52" />
            ))}
          </div>
        ) : visiblePets.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-3">🐾</p>
            <p className="text-gray-400 font-medium mb-4">No tienes mascotas publicadas</p>
            <button
              onClick={() => navigate("/shelter/create-pet")}
              className="bg-pink-500 text-white font-bold text-sm px-6 py-2.5 rounded-full shadow-md shadow-pink-200"
            >
              Publicar primera mascota
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {visiblePets.map((pet) => (
              <ShelterPetCard key={pet.id} pet={pet} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => navigate("/shelter/create-pet")}
        className="fixed bottom-20 right-5 z-50 w-14 h-14 bg-pink-500 hover:bg-pink-600 active:scale-95 text-white rounded-full shadow-xl shadow-pink-300 flex items-center justify-center transition-all"
        title="Publicar nueva mascota"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 px-4 py-2">
        <div className="max-w-md mx-auto flex items-center justify-around">
          <NavBtn icon="dashboard" label="Dashboard" active onClick={() => navigate("/shelter/dashboard")} />
          <NavBtn icon="requests" label="Solicitudes" onClick={() => navigate("/shelter/requests")} />
          <NavBtn icon="add" label="Publicar" onClick={() => navigate("/shelter/create-pet")} />
          <NavBtn icon="profile" label="Perfil" onClick={() => navigate("/profile")} />
        </div>
      </nav>
    </div>
  );
};

type NavBtnProps = { icon: string; label: string; active?: boolean; onClick: () => void };

const NavBtn = ({ icon, label, active, onClick }: NavBtnProps) => {
const icons: Record<string, React.ReactElement> = {
    dashboard: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
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
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  };

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
        active ? "text-pink-500" : "text-gray-400 hover:text-gray-600"
      }`}
    >
      {icons[icon]}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
};

export default ShelterDashboardPage;