interface Props {
  conversations: any[];
  activeConversationId?: string;
  isLoading: boolean;
  currentUserId: string;
  onSelect: (id: string) => void;
}

export function ConversationList({
  conversations,
  isLoading,
  onSelect,
}: Props) {
  if (isLoading) {
    return <p>Loading conversations...</p>;
  }

  return (
    <div>
      {conversations.map((conversation) => (
        <button
          key={conversation.id}
          onClick={() => onSelect(conversation.id)}
          style={{
            display: 'block',
            marginBottom: '1rem',
          }}
        >
          Conversation {conversation.id}
        </button>
      ))}
    </div>
  );
}