import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShelterAdoptions } from "../../hooks/useAdoptions";
import { useChatContext } from "../../providers/ChatProvider";
import { useAuth } from "../../hooks/useAuth";
import { ChatWindow } from "../../components/chat/ChatWindow";

type FilterStatus = "all" | "PENDING" | "APPROVED" | "REJECTED";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pendiente",
  APPROVED: "Aceptada",
  REJECTED: "Rechazada",
};

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-500",
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
};

const AdoptionRequestsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const { adoptions, isLoading, approve, reject } = useShelterAdoptions(
    filter !== "all" ? { status: filter as any } : undefined
  );

  const {
    messages,
    hasMore,
    messagesLoading,
    isSending,
    sendMessage,
    loadMoreMessages,
    openOrCreateConversation,
  } = useChatContext();

  const handleChat = async (adopterId: string, petId: string) => {
    if (!user?.id) return;
    // 🔥 Ahora pasa 3 parámetros: adopter, shelter (user.id), pet
    const conversationId = await openOrCreateConversation(adopterId, user.id, petId);
    setActiveChatId(conversationId);
  };

  const pendingCount = adoptions.filter((r) => r.status === "PENDING").length;

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
          {(["all", "PENDING", "APPROVED", "REJECTED"] as const).map((f) => (
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
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-20 animate-pulse" />
            ))}
          </div>
        ) : adoptions.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-gray-400 font-medium">No hay solicitudes aquí</p>
          </div>
        ) : (
          <div className="space-y-3">
            {adoptions.map((req) => (
              <RequestCard
                key={req.id}
                req={req}
                onApprove={() => approve(req.id)}
                onReject={() => reject(req.id)}
                onChat={() => handleChat(req.adopter_id, req.pet_id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Chat Overlay */}
      {activeChatId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center">
          <div className="w-full max-w-lg h-[70vh] bg-white rounded-t-3xl overflow-hidden">
            <ChatWindow
              messages={messages}
              hasMore={hasMore}
              isLoading={messagesLoading}
              isSending={isSending}
              currentUserId={user?.id || ""}
              conversationTitle="Chat con adoptante"
              onSend={sendMessage}
              onLoadMore={loadMoreMessages}
              onClose={() => setActiveChatId(null)}
            />
          </div>
        </div>
      )}

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 px-4 py-2">
        <div className="max-w-md mx-auto flex items-center justify-around">
          <NavBtn icon="dashboard" label="Dashboard" onClick={() => navigate("/shelter/dashboard")} />
          <NavBtn icon="requests" label="Solicitudes" active onClick={() => navigate("/shelter/requests")} />
          <NavBtn icon="add" label="Publicar" onClick={() => navigate("/shelter/create-pet")} />
          <NavBtn icon="profile" label="Perfil" onClick={() => navigate("/profile")} />
        </div>
      </nav>
    </div>
  );
};

const RequestCard = ({
  req,
  onApprove,
  onReject,
  onChat,
}: {
  req: any;
  onApprove: () => void;
  onReject: () => void;
  onChat: () => void;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left px-4 py-4 flex items-center gap-3"
      >
        <div className="w-11 h-11 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 font-bold text-sm flex-shrink-0">
          {req.adopter_id?.slice(0, 2).toUpperCase() ?? "??"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm truncate">
            Solicitud #{req.id.slice(0, 8)}
          </p>
          <p className="text-gray-400 text-xs truncate">
            {formatDate(req.created_at)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[req.status] ?? ""}`}>
            {STATUS_LABEL[req.status] ?? req.status}
          </span>
          <svg
            className={`w-4 h-4 text-gray-300 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-50 px-4 pb-4 pt-3">
          {req.message && (
            <div className="mb-4">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Mensaje</p>
              <p className="text-sm text-gray-600 leading-relaxed">{req.message}</p>
            </div>
          )}

          {req.status === "PENDING" && (
            <div className="flex gap-2">
              <button
                onClick={onChat}
                className="flex items-center gap-1.5 border border-gray-200 text-gray-400 text-xs font-bold px-3 py-2 rounded-full hover:border-blue-300 hover:text-blue-400 transition-colors"
              >
                💬 Chat
              </button>
              <button
                onClick={onReject}
                className="flex-1 border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400 text-xs font-bold py-2 rounded-full transition-colors"
              >
                Rechazar
              </button>
              <button
                onClick={onApprove}
                className="flex-1 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold py-2 rounded-full transition-colors shadow-md shadow-pink-200"
              >
                Aceptar
              </button>
            </div>
          )}

          {req.status !== "PENDING" && (
            <div className={`text-center py-2 rounded-full text-xs font-bold ${STATUS_STYLE[req.status]}`}>
              Solicitud {STATUS_LABEL[req.status]?.toLowerCase()}
            </div>
          )}
        </div>
      )}
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