interface ChatWindowProps {
  messages: any[];
  hasMore: boolean;
  isLoading: boolean;
  isSending: boolean;
  currentUserId: string;
  conversationTitle: string;
  onSend: (message: string) => void;
  onLoadMore: () => void;
  onClose: () => void;
}

export const ChatWindow = (_props: ChatWindowProps) => {
  return <div>Chat Window</div>;
};