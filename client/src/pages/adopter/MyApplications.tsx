import { useState } from 'react';
import { useAdoptions } from '../../hooks/useAdoptions';
import { useChat } from '../../hooks/useChat';
import { AdoptionCard } from '../../components/adoptions/AdoptionCard';
import { ChatWindow } from '../../components/chat/ChatWindow';
import type { AdoptionStatus } from '../../types/adoption.types';

// TODO: Replace with real auth context value once auth module is integrated
const CURRENT_USER_ID = 'REPLACE_WITH_AUTH_CONTEXT';

export function MyApplications() {
  const [statusFilter, setStatusFilter] = useState<AdoptionStatus | undefined>(undefined);

  const { adoptions, pagination, isLoading, error } = useAdoptions({
    status: statusFilter,
    limit: 12,
  });

  const {
    conversation,
    messages,
    hasMore,
    isLoading: messagesLoading,
    isSending,
    send,
    loadMore,
    close,
  } = useChat();

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

      {/* Inline chat panel (slides in when conversation is opened) */}
      {conversation && (
        <div className="chat-panel-overlay">
          <ChatWindow
            messages={messages}
            hasMore={hasMore}
            isLoading={messagesLoading}
            isSending={isSending}
            currentUserId={CURRENT_USER_ID}
            conversationTitle="Chat with Shelter"
            onSend={send}
            onLoadMore={loadMore}
            onClose={close}
          />
        </div>
      )}
    </main>
  );
}
