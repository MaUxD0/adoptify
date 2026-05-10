import { useState } from "react";
import { useAdoptions } from "../../hooks/useAdoptions";
import { AdoptionCard } from "../../components/adoptions/AdoptionCard";
import { ChatWindow } from "../../components/chat/ChatWindow";
import { useAuth } from "../../hooks/useAuth";
import { useChatContext } from "../../providers/ChatProvider";
import type { Adoption } from "../../types/adoption.types";

function MyApplications() {
  const [statusFilter] = useState();
  const [trackingAdoption, setTrackingAdoption] = useState<Adoption | null>(null);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const { user } = useAuth();

  const {
    messages,
    hasMore,
    messagesLoading,
    isSending,
    sendMessage,
    loadMoreMessages,
    openOrCreateConversation,
  } = useChatContext();

  const { adoptions, error } = useAdoptions({
    status: statusFilter,
    limit: 12,
  });

  // ✅ FIX REAL: chat correcto con PET ID incluido
  const handleChat = async (adoption: any) => {
    if (!user?.id) return;

    const shelterId = adoption.pets?.shelter_id;
    const petId = adoption.pet_id || adoption.pets?.id;

    if (!shelterId || !petId) return;

    // 🔥 IMPORTANTE: 3 parámetros
    const conversationId = await openOrCreateConversation(
      user.id,
      shelterId,
      petId
    );

    setActiveChatId(conversationId);
  };

  const handleViewTracking = (adoption: Adoption) => {
    setTrackingAdoption(adoption);
  };

  const closeTracking = () => setTrackingAdoption(null);

  return (
    <main className="min-h-screen bg-white font-sans px-4 py-6">
      <h1 className="text-2xl font-black text-gray-900 mb-6">
        My Applications
      </h1>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {adoptions.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🐾</p>
          <p className="text-gray-400 font-medium">No applications yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {adoptions.map((adoption) => (
            <AdoptionCard
              key={adoption.id}
              adoption={adoption}
              onChat={() => handleChat(adoption)}
              onViewTracking={handleViewTracking}
            />
          ))}
        </div>
      )}

      {/* TRACKING */}
      {trackingAdoption && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-xl">

            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Tracking</h2>
              <button onClick={closeTracking}>✕</button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                <span>Status</span>
                <span className="font-bold">{trackingAdoption.status}</span>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-500">Message</p>
                <p>{trackingAdoption.message || "No message"}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-500">Created</p>
                <p>{new Date(trackingAdoption.created_at).toLocaleString()}</p>
              </div>
            </div>

            <button
              onClick={closeTracking}
              className="w-full mt-6 bg-pink-500 text-white py-3 rounded-xl font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* CHAT */}
      {activeChatId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center">
          <div className="w-full max-w-lg h-[70vh] bg-white rounded-t-3xl overflow-hidden">

            <ChatWindow
              messages={messages}
              hasMore={hasMore}
              isLoading={messagesLoading}
              isSending={isSending}
              currentUserId={user?.id || ""}
              conversationTitle="Chat with Shelter"
              onSend={sendMessage}
              onLoadMore={loadMoreMessages}
              onClose={() => setActiveChatId(null)}
            />

          </div>
        </div>
      )}
    </main>
  );
}

export default MyApplications;