import { create } from "zustand";

type ActiveChatState = {
  activeChat: string;
  setActiveChat: (activeChat: string) => void;
};

export const useActiveChatStore = create<ActiveChatState>((set) => ({
  activeChat: "",
  setActiveChat: (activeChat: string) => set({ activeChat }),
}));
