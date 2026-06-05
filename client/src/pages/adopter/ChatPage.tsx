import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChatWindow } from "../../components/chat/ChatWindow";
import { useAuth } from "../../hooks/useAuth";
import { useChatContext } from "../../providers/ChatProvider";

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    messages,
    hasMore,
    messagesLoading,
    isSending,
    sendMessage,
    loadMoreMessages,
    openConversation,
    conversations,
  } = useChatContext();

  useEffect(() => {
    if (id) {
      openConversation(id).catch((err: any) => {
        console.error('error opening conversation:', err);
      });
    }
  }, [id]);

  const activeConversation = conversations.find(c => c.id === id);
  const otherPartyName = activeConversation?.shelter?.name || "Shelter";

  return (
    <div className="h-screen">
      <ChatWindow
        messages={messages}
        hasMore={hasMore}
        isLoading={messagesLoading}
        isSending={isSending}
        currentUserId={user?.id || ""}
        conversationTitle={`Chat with ${otherPartyName}`}
        onSend={sendMessage}
        onLoadMore={loadMoreMessages}
        onClose={() => navigate(-1)}
      />
    </div>
  );
}