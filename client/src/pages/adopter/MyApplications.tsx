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

  const handleChat = async (adoption: any) => {
    const shelterId = adoption.pets?.shelter_id;
    if (!shelterId || !user?.id) return;
    const conversationId = await openOrCreateConversation(user.id, shelterId);
    setActiveChatId(conversationId);
  };

  const handleViewTracking = (adoption: Adoption) => {
    setTrackingAdoption(adoption);
  };

  const closeTracking = () => setTrackingAdoption(null);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6">
      <h1 className="text-2xl font-black text-gray-900 mb-6">My Applications</h1>

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
              onChat={handleChat}
              onViewTracking={handleViewTracking}
            />
          ))}
        </div>
      )}

      {/* Tracking Modal */}
      {trackingAdoption && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                  Tracking details
                </p>
                <h2 className="text-xl font-bold text-gray-900 mt-2">
                  Adoption status
                </h2>
              </div>
              <button type="button" onClick={closeTracking} className="text-gray-400 hover:text-gray-700">
                Close
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm text-gray-700">
              <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <span className="text-xs uppercase tracking-[0.2em] text-gray-500">Current status</span>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                  trackingAdoption.status === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-800'
                    : trackingAdoption.status === 'APPROVED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {trackingAdoption.status}
                </span>
              </div>

              <div className="rounded-2xl border border-gray-200 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Created at</p>
                <p className="text-sm text-gray-900">
                  {new Date(trackingAdoption.created_at).toLocaleString([], {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Message</p>
                <p className="text-sm text-gray-900">
                  {trackingAdoption.message || 'No message provided.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeTracking}
              className="mt-6 w-full rounded-2xl bg-pink-500 px-4 py-3 text-sm font-semibold text-white hover:bg-pink-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

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