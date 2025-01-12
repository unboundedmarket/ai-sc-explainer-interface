export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface MainContentProps {
  contract: {
    model: string;
    name: string;
    source: string;
    code: string;
    explanation: string;
  };
  isDarkMode: boolean;
  isCollapsed: boolean;
}