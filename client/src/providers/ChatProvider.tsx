import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ChatContext = createContext<any>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  return <ChatContext.Provider value={{}}>{children}</ChatContext.Provider>;
}

export function useChatContext() {
  return useContext(ChatContext);
}