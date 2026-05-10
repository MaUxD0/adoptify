import React from 'react';
import { ConversationList } from '../../components/chat/ConversationList';
import { ChatWindow } from '../../components/chat/ChatWindow';
import { useConversations, useChat } from '../../hooks/useChat';

// TODO: Replace with real auth context value once auth module is integrated
const CURRENT_USER_ID = 'REPLACE_WITH_AUTH_CONTEXT';

export function ShelterChat() {
  const {
    conversations,
    isLoading: conversationsLoading,
    activeConversationId,
    open,
    close,
  } = useConversations();

  const {
    conversation,
    messages,
    hasMore,
    isLoading: messagesLoading,
    isSending,
    send,
    loadMore,
  } = useChat();

  return (
    <main className="shelter-chat-layout">
      {/* Sidebar: conversation list */}
      <aside className="chat-sidebar">
        <h2 className="chat-sidebar__title">Messages</h2>
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversationId}
          isLoading={conversationsLoading}
          currentUserId={CURRENT_USER_ID}
          onSelect={open}
        />
      </aside>

      {/* Main: chat window */}
      <section className="chat-main">
        {conversation ? (
          <ChatWindow
            messages={messages}
            hasMore={hasMore}
            isLoading={messagesLoading}
            isSending={isSending}
            currentUserId={CURRENT_USER_ID}
            conversationTitle="Adoption Chat"
            onSend={send}
            onLoadMore={loadMore}
            onClose={close}
          />
        ) : (
          <div className="chat-empty-state">
            <span className="chat-empty-state__icon">💬</span>
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </section>
    </main>
  );
}
