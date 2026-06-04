import { ConversationList } from '../../components/chat/ConversationList';
import { ChatWindow } from '../../components/chat/ChatWindow';
import { useConversations, useChat } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';

export function ShelterChat() {
  const { user } = useAuth();
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

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <main className="shelter-chat-layout">
      <aside className="chat-sidebar">
        <h2 className="chat-sidebar__title">Messages</h2>

        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversationId}
          isLoading={conversationsLoading}
          currentUserId={user.id}
          onSelect={open}
        />
      </aside>

      <section className="chat-main">
        {conversation ? (
          <ChatWindow
            messages={messages}
            hasMore={hasMore}
            isLoading={messagesLoading}
            isSending={isSending}
            currentUserId={user.id}
            conversationTitle={
              conversation.adopter?.name
                ? `Chat with ${conversation.adopter.name}`
                : 'Adoption Chat'
            }
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

export default ShelterChat;