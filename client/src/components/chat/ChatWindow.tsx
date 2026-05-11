import { useEffect, useRef, useState } from 'react';
import styles from './ChatWindow.module.css';

interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface ChatWindowProps {
  messages: Message[];
  hasMore: boolean;
  isLoading: boolean;
  isSending: boolean;
  currentUserId: string;
  conversationTitle: string;
  onSend: (content: string) => void;
  onLoadMore: () => void;
  onClose: () => void;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ChatWindow({
  messages,
  hasMore,
  isLoading,
  isSending,
  currentUserId,
  conversationTitle,
  onSend,
  onLoadMore,
  onClose,
}: ChatWindowProps) {
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll al último mensaje cuando llegan mensajes nuevos
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;
    setText('');
    onSend(trimmed);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className={styles.window}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.headerTitle}>{conversationTitle}</span>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close chat"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className={styles.messages}>
        {/* Load more */}
        {hasMore && (
          <div className={styles.loadMore}>
            <button
              onClick={onLoadMore}
              disabled={isLoading}
              className={styles.loadMoreBtn}
            >
              {isLoading ? 'Loading…' : 'Load earlier messages'}
            </button>
          </div>
        )}

        {/* Spinner on first load */}
        {isLoading && messages.length === 0 && (
          <div className={styles.stateCenter}>Loading messages…</div>
        )}

        {/* Empty */}
        {!isLoading && messages.length === 0 && (
          <div className={styles.stateCenter}>
            <span style={{ fontSize: 32, display: 'block', marginBottom: 8 }}>
              💬
            </span>
            No messages yet. Start the conversation!
          </div>
        )}

        {/* Bubbles */}
        {messages.map((msg) => {
          const isMine = msg.sender_id === currentUserId;
          return (
            <div
              key={msg.id}
              className={`${styles.row} ${isMine ? styles.rowMine : styles.rowTheirs}`}
            >
              <div
                className={`${styles.bubble} ${isMine ? styles.bubbleMine : styles.bubbleTheirs}`}
              >
                <span className={styles.bubbleContent}>{msg.content}</span>
                <span className={styles.bubbleMeta}>
                  {formatTime(msg.created_at)}
                  {isMine && (
                    <span className={styles.readTick}>
                      {msg.is_read ? ' ✓✓' : ' ✓'}
                    </span>
                  )}
                </span>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className={styles.inputRow}>
        <textarea
          className={styles.textarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message… (Enter to send)"
          rows={1}
          disabled={isSending}
        />
        <button
          className={styles.sendBtn}
          onClick={handleSend}
          disabled={!text.trim() || isSending}
          aria-label="Send message"
        >
          {isSending ? '⏳' : '➤'}
        </button>
      </div>
    </div>
  );
}