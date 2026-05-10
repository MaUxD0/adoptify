import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useChatContext } from "../../providers/ChatProvider";
import { ConversationList } from "../../components/chat/ConversationList";
import { ChatWindow } from "../../components/chat/ChatWindow";

export default function ChatsListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    conversations,
    conversationsLoading,
    messages,
    hasMore,
    messagesLoading,
    isSending,
    sendMessage,
    loadMoreMessages,
    loadConversations,
    openConversation,
    activeConversationId,
  } = useChatContext();

  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const handleSelect = async (id: string) => {
    await openConversation(id);
    setActiveChatId(id);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-gray-800 transition-colors"
        >
          ←
        </button>
        <h1 className="text-lg font-black text-gray-900">Messages</h1>
      </header>

      {/* List */}
      <div className="px-4 py-4">
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversationId}
          isLoading={conversationsLoading}
          currentUserId={user?.id || ""}
          onSelect={handleSelect}
        />
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
              conversationTitle="Chat"
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