export type ChatMessage = {
  id: string;
  chatId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type ChatPreview = {
  id: string;
  title: string;
  preview: string;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string | null;
};
