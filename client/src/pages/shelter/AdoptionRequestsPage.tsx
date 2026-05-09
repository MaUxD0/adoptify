import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type RequestStatus = "pending" | "accepted" | "rejected";

interface AdoptionRequest {
  id: string;
  pet_id: string;
  pet_name: string;
  pet_image: string;
  adopter_name: string;
  adopter_email: string;
  adopter_phone: string;
  adopter_avatar: string;
  adopter_message: string;
  created_at: string;
  status: RequestStatus;
}

// ── Datos mock — tu compañero reemplazará esto con el API real ──
const MOCK_REQUESTS: AdoptionRequest[] = [
  {
    id: "req-001",
    pet_id: "pet-1",
    pet_name: "Luna",
    pet_image: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=200&q=80",
    adopter_name: "María García",
    adopter_email: "maria.garcia@email.com",
    adopter_phone: "+57 311 234 5678",
    adopter_avatar: "https://i.pravatar.cc/150?img=47",
    adopter_message: "Tengo experiencia con perros, vivo en casa con jardín y busco una compañera para mi familia. Luna sería perfecta.",
    created_at: "2026-05-07T10:30:00Z",
    status: "pending",
  },
  {
    id: "req-002",
    pet_id: "pet-2",
    pet_name: "Max",
    pet_image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&q=80",
    adopter_name: "Carlos Pérez",
    adopter_email: "carlos.perez@email.com",
    adopter_phone: "+57 300 876 5432",
    adopter_avatar: "https://i.pravatar.cc/150?img=12",
    adopter_message: "Soy veterinario y puedo darle los mejores cuidados a Max. Tengo apartamento amplio.",
    created_at: "2026-05-06T15:00:00Z",
    status: "pending",
  },
  {
    id: "req-003",
    pet_id: "pet-3",
    pet_name: "Kira",
    pet_image: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=200&q=80",
    adopter_name: "Ana Martínez",
    adopter_email: "ana.martinez@email.com",
    adopter_phone: "+57 315 999 1122",
    adopter_avatar: "https://i.pravatar.cc/150?img=23",
    adopter_message: "Busco un gato tranquilo para mi apartamento. Tengo toda la experiencia necesaria.",
    created_at: "2026-05-05T09:20:00Z",
    status: "accepted",
  },
  {
    id: "req-004",
    pet_id: "pet-1",
    pet_name: "Luna",
    pet_image: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=200&q=80",
    adopter_name: "Pedro López",
    adopter_email: "pedro.lopez@email.com",
    adopter_phone: "+57 301 555 6677",
    adopter_avatar: "https://i.pravatar.cc/150?img=33",
    adopter_message: "Me encanta Luna, tengo niños en casa y buscamos una mascota amigable.",
    created_at: "2026-05-04T14:00:00Z",
    status: "rejected",
  },
];

const STATUS_LABEL: Record<RequestStatus, string> = {
  pending: "Pendiente",
  accepted: "Aceptada",
  rejected: "Rechazada",
};

const STATUS_STYLE: Record<RequestStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-500",
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
};

// ── Detalle del adoptante (expandible) ──────────────────────
const RequestCard = ({
  req,
  onAccept,
  onReject,
}: {
  req: AdoptionRequest;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Fila principal */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left px-4 py-4 flex items-center gap-3"
      >
        <img
          src={req.adopter_avatar}
          alt={req.adopter_name}
          className="w-11 h-11 rounded-full object-cover flex-shrink-0 border-2 border-pink-100"
        />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm truncate">{req.adopter_name}</p>
          <p className="text-gray-400 text-xs truncate">
            quiere adoptar a <span className="text-pink-500 font-semibold">{req.pet_name}</span>
          </p>
          <p className="text-gray-300 text-[10px] mt-0.5">{formatDate(req.created_at)}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[req.status]}`}>
            {STATUS_LABEL[req.status]}
          </span>
          <svg
            className={`w-4 h-4 text-gray-300 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Detalle expandido */}
      {expanded && (
        <div className="border-t border-gray-50 px-4 pb-4 pt-3">
          {/* Mascota */}
          <div className="flex items-center gap-3 mb-3">
            <img
              src={req.pet_image}
              alt={req.pet_name}
              className="w-14 h-14 rounded-xl object-cover border border-gray-100"
            />
            <div>
              <p className="text-xs text-gray-400">Mascota solicitada</p>
              <p className="font-bold text-gray-900">{req.pet_name}</p>
            </div>
          </div>

          {/* Info de contacto */}
          <div className="bg-gray-50 rounded-xl p-3 mb-3 space-y-1.5">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">
              Datos del adoptante
            </p>
            <div className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-xs text-gray-600">{req.adopter_email}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-xs text-gray-600">{req.adopter_phone}</span>
            </div>
          </div>

          {/* Mensaje */}
          <div className="mb-4">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">
              Mensaje
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">{req.adopter_message}</p>
          </div>

          {/* Acciones (solo si está pendiente) */}
          {req.status === "pending" && (
            <div className="flex gap-2">
              {/* Botón chat — placeholder para el compañero */}
              <button
                className="flex items-center gap-1.5 border border-gray-200 text-gray-400 text-xs font-bold px-3 py-2 rounded-full hover:border-blue-300 hover:text-blue-400 transition-colors"
                title="Chat — será implementado por otro compañero"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Chat
              </button>
              <button
                onClick={() => onReject(req.id)}
                className="flex-1 border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400 text-xs font-bold py-2 rounded-full transition-colors"
              >
                Rechazar
              </button>
              <button
                onClick={() => onAccept(req.id)}
                className="flex-1 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold py-2 rounded-full transition-colors shadow-md shadow-pink-200"
              >
                Aceptar
              </button>
            </div>
          )}

          {req.status !== "pending" && (
            <div className={`text-center py-2 rounded-full text-xs font-bold ${STATUS_STYLE[req.status]}`}>
              Solicitud {STATUS_LABEL[req.status].toLowerCase()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Página principal ─────────────────────────────────────────
const AdoptionRequestsPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<AdoptionRequest[]>(MOCK_REQUESTS);
  const [filter, setFilter] = useState<RequestStatus | "all">("all");

  const handleAccept = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "accepted" } : r))
    );
  };

  const handleReject = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r))
    );
  };

  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);
  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-28">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-100 px-5 py-4 flex items-center gap-3 sticky top-0 z-40">
        <button
          onClick={() => navigate("/shelter/dashboard")}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-gray-900 font-black text-base">Solicitudes de adopción</h1>
          {pendingCount > 0 && (
            <p className="text-pink-500 text-xs font-medium">
              {pendingCount} pendiente{pendingCount > 1 ? "s" : ""}
            </p>
          )}
        </div>
      </header>

      <div className="px-5 pt-5">
        {/* FILTROS */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {(["all", "pending", "accepted", "rejected"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-shrink-0 text-xs font-bold px-4 py-1.5 rounded-full transition-colors ${
                filter === f
                  ? "bg-pink-500 text-white shadow-md shadow-pink-200"
                  : "bg-white text-gray-400 border border-gray-200 hover:border-pink-300 hover:text-pink-500"
              }`}
            >
              {f === "all" ? "Todas" : STATUS_LABEL[f]}
            </button>
          ))}
        </div>

        {/* LISTA */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-gray-400 font-medium">No hay solicitudes aquí</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((req) => (
              <RequestCard
                key={req.id}
                req={req}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            ))}
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 px-4 py-2">
        <div className="max-w-md mx-auto flex items-center justify-around">
          <NavBtn icon="dashboard" label="Dashboard" onClick={() => navigate("/shelter/dashboard")} />
          <NavBtn icon="requests" label="Solicitudes" active onClick={() => navigate("/shelter/requests")} />
          <NavBtn icon="add" label="Publicar" onClick={() => navigate("/shelter/create-pet")} />
          <NavBtn icon="profile" label="Perfil" onClick={() => {}} />
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

export default AdoptionRequestsPage;