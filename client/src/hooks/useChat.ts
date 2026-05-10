import { useEffect } from 'react';
import { useChatContext } from '../providers/ChatProvider';

export function useConversations() {
  const {
    conversations,
    conversationsLoading: isLoading,
    activeConversationId,
    loadConversations,
    openConversation: open,
    closeConversation: close,
  } = useChatContext();

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    isLoading,
    activeConversationId,
    open,
    close,
  };
}


export function useChat() {
  const {
    activeConversation: conversation,
    messages,
    hasMore,
    messagesLoading: isLoading,
    isSending,
    sendMessage: send,
    loadMoreMessages: loadMore,
    closeConversation: close,
    openOrCreateConversation,
  } = useChatContext();

  return {
    conversation,
    messages,
    hasMore,
    isLoading,
    isSending,
    send,
    loadMore,
    close,
    openOrCreateConversation,
  };
}


//export function useOpenChat() {
 // const { openOrCreateConversation } = useChatContext();

  //return (dto: CreateConversationDto) => openOrCreateConversation(dto);
//}