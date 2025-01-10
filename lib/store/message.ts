import { create } from "zustand";

interface Message {
  content: string;
  conversation_id: number;
  created_at: string;
  edited_at: string | null;
  id: number;
  message_uuid: string | null;
  read_at: string | null;
  sender_id: string;
}

// const useMessage = create<Message>()((set) => ({
    
// }));
