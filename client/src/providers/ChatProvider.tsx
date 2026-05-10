import {
  createContext,
  useCallback,
  useContext,
  useReducer,
  type ReactNode,
} from 'react';
import { chatService } from '../services/chat.service';

interface Conversation {
  id: string;
  adopter_id: string;
  shelter_id: string;
  pet_id?: string;
  created_at: string;
  adopter?: { id: string; name: string };
  shelter?: { id: string; name: string };
  pet?: { id: string; name: string };
}

interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Message[];
  messagesPage: number;
  messagesTotal: number;
  conversationsLoading: boolean;
  messagesLoading: boolean;
  isSending: boolean;
}

type ChatAction =
  | { type: 'CONVERSATIONS_SUCCESS'; payload: Conversation[] }
  | { type: 'CONVERSATIONS_LOADING' }
  | { type: 'MESSAGES_LOADING' }
  | { type: 'MESSAGES_SUCCESS'; payload: { messages: Message[]; total: number; page: number; prepend: boolean } }
  | { type: 'SEND_START' }
  | { type: 'SEND_SUCCESS'; payload: Message }
  | { type: 'SET_ACTIVE'; payload: string }
  | { type: 'CLOSE' };

const initialState: ChatState = {
  conversations: [],
  activeConversationId: null,
  messages: [],
  messagesPage: 1,
  messagesTotal: 0,
  conversationsLoading: false,
  messagesLoading: false,
  isSending: false,
};

function reducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'CONVERSATIONS_LOADING':
      return { ...state, conversationsLoading: true };
    case 'CONVERSATIONS_SUCCESS':
      return { ...state, conversationsLoading: false, conversations: action.payload };
    case 'MESSAGES_LOADING':
      return { ...state, messagesLoading: true };
    case 'MESSAGES_SUCCESS':
      return {
        ...state,
        messagesLoading: false,
        messages: action.payload.prepend
          ? [...action.payload.messages, ...state.messages]
          : action.payload.messages,
        messagesTotal: action.payload.total,
        messagesPage: action.payload.page,
      };
    case 'SEND_START':
      return { ...state, isSending: true };
    case 'SEND_SUCCESS':
      return { ...state, isSending: false, messages: [...state.messages, action.payload] };
    case 'SET_ACTIVE':
      return { ...state, activeConversationId: action.payload, messages: [], messagesPage: 1, messagesTotal: 0 };
    case 'CLOSE':
      return { ...state, activeConversationId: null, messages: [], messagesPage: 1, messagesTotal: 0 };
    default:
      return state;
  }
}

interface ChatContextValue extends ChatState {
  activeConversation: Conversation | null;
  hasMore: boolean;
  loadConversations: () => Promise<void>;
  openConversation: (id: string) => Promise<void>;
  closeConversation: () => void;
  loadMoreMessages: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadConversations = useCallback(async () => {
    dispatch({ type: 'CONVERSATIONS_LOADING' });
    const conversations = await chatService.getConversations();
    dispatch({ type: 'CONVERSATIONS_SUCCESS', payload: conversations });
  }, []);

  const openConversation = useCallback(async (id: string) => {
    dispatch({ type: 'SET_ACTIVE', payload: id });
    dispatch({ type: 'MESSAGES_LOADING' });
    const result = await chatService.getMessages(id, 1);
    dispatch({
      type: 'MESSAGES_SUCCESS',
      payload: { messages: result.data, total: result.total, page: 1, prepend: false },
    });
  }, []);

  const closeConversation = useCallback(() => {
    dispatch({ type: 'CLOSE' });
  }, []);

  const loadMoreMessages = useCallback(async () => {
    const { activeConversationId, messagesPage, messagesTotal, messages } = state;
    if (!activeConversationId || messages.length >= messagesTotal) return;
    dispatch({ type: 'MESSAGES_LOADING' });
    const result = await chatService.getMessages(activeConversationId, messagesPage + 1);
    dispatch({
      type: 'MESSAGES_SUCCESS',
      payload: { messages: result.data, total: result.total, page: messagesPage + 1, prepend: true },
    });
  }, [state]);

  const sendMessage = useCallback(async (content: string) => {
    const { activeConversationId } = state;
    if (!activeConversationId || !content.trim()) return;
    dispatch({ type: 'SEND_START' });
    const message = await chatService.sendMessage(activeConversationId, content.trim());
    dispatch({ type: 'SEND_SUCCESS', payload: message });
  }, [state]);

  const activeConversation = state.conversations.find(c => c.id === state.activeConversationId) ?? null;
  const hasMore = state.messages.length < state.messagesTotal;

  return (
    <ChatContext.Provider value={{
      ...state,
      activeConversation,
      hasMore,
      loadConversations,
      openConversation,
      closeConversation,
      loadMoreMessages,
      sendMessage,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext must be used inside ChatProvider');
  return ctx;
}