import { useState, useContext } from 'react';
import { useAdoptions } from '../../hooks/useAdoptions';
import { useConversations, useChat } from '../../hooks/useChat';
import { AdoptionCard } from '../../components/adoptions/AdoptionCard';
import { ChatWindow } from '../../components/chat/ChatWindow';
import type { AdoptionStatus } from '../../types/adoption.types';
import { AuthContext } from '../../contexts/AuthContext';

function MyApplications() {
  const [statusFilter, setStatusFilter] = useState<AdoptionStatus | undefined>(undefined);
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  const { adoptions, pagination, isLoading, error } = useAdoptions({
    status: statusFilter,
    limit: 12,
  });

  const { conversations, open, close } = useConversations();

  const {
    conversation,
    messages,
    hasMore,
    isLoading: messagesLoading,
    isSending,
    send,
    loadMore,
    close: closeChat,
  } = useChat();

  const handleChat = (adoptionId: string) => {
    // Find conversation related to this adoption
    // For now, assume conversations are linked by some field, or create/open one
    // This is a simplified implementation - in reality you'd need to link conversations to adoptions
    const conversation = conversations.find(c => c.pet_id === adoptionId);
    if (conversation) {
      open(conversation.id);
    }
  };

  const handleCloseChat = () => {
    closeChat();
    close(); // Close from conversations
  };

  return (
    <main className="my-applications">
      <header className="my-applications__header">
        <h1>My Applications</h1>
        <p>Track the status of your adoption requests</p>

        {/* Status filter */}
        <div className="filter-toolbar" role="group" aria-label="Filter by status">
          {(['PENDING', 'APPROVED', 'REJECTED'] as const).map((s) => (
            <button
              key={s}
              className={`filter-btn ${statusFilter === s ? 'filter-btn--active' : ''}`}
              onClick={() => setStatusFilter((prev) => (prev === s ? undefined : s))}
            >
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </header>

      {error && (
        <div className="error-banner" role="alert">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="adoption-grid adoption-grid--loading">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="adoption-card-skeleton" />
          ))}
        </div>
      ) : adoptions.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state__icon">🐾</span>
          <p>You haven't submitted any adoption requests yet.</p>
        </div>
      ) : (
        <div className="adoption-grid">
          {adoptions.map((adoption) => (
            <AdoptionCard
              key={adoption.id}
              adoption={adoption}
              viewMode="adopter"
              onChat={handleChat}
            />
          ))}
        </div>
      )}

      {/* Total count */}
      {pagination && (
        <p className="results-count">
          Showing {adoptions.length} of {pagination.total} applications
        </p>
      )}

      {/* Inline chat panel */}
      {conversation && (
        <div className="chat-panel-overlay">
          <ChatWindow
            messages={messages}
            hasMore={hasMore}
            isLoading={messagesLoading}
            isSending={isSending}
            currentUserId={user?.id || ''}
            conversationTitle="Chat with Shelter"
            onSend={send}
            onLoadMore={loadMore}
            onClose={handleCloseChat}
          />
        </div>
      )}
    </main>
  );
}

export default MyApplications;