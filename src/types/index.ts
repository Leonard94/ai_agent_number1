export interface RequirementAnalysis {
  tldr: string;
  todoList: string[];
  questions: string[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface RequirementInputProps {
  requirement: string;
  isAnalyzing: boolean;
  onRequirementChange: (value: string) => void;
  onAnalyze: () => void;
  onClear: () => void;
}

export interface TldrCardProps {
  tldr: string;
}

export interface TodoCardProps {
  todoList: string[];
}

export interface QuestionsCardProps {
  questions: string[];
}

export interface ChatProps {
  chatMessages: ChatMessage[];
  currentMessage: string;
  isChatting: boolean;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export interface ChatMessageProps {
  message: ChatMessage;
}

export interface ChatInputProps {
  currentMessage: string;
  isChatting: boolean;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export interface GigaChatRequest {
  model: string;
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
}

export interface GigaChatResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface AppState {
  requirement: string;
  analysis: RequirementAnalysis | null;
  chatMessages: ChatMessage[];
  currentMessage: string;
  isAnalyzing: boolean;
  isChatting: boolean;
}

export type MessageRole = "user" | "assistant";
export type LoadingState = "idle" | "loading" | "success" | "error";

export interface UseAnalysisReturn {
  requirement: string;
  analysis: RequirementAnalysis | null;
  isAnalyzing: boolean;
  setRequirement: (value: string) => void;
  analyzeRequirement: () => Promise<void>;
  clearAnalysis: () => void;
}

export interface UseChatReturn {
  chatMessages: ChatMessage[];
  currentMessage: string;
  isChatting: boolean;
  setCurrentMessage: (value: string) => void;
  sendMessage: () => Promise<void>;
  clearChat: () => void;
}
