export interface Conversation {
  id: number;
  conversation_uuid: string | null;
  // country_id: number | null;
  // created_at: string;
  // last_message_id: number | null;
  // updated_at: string;
  // user1_id: string;
  // user2_id: string;
  // user1: User | null;
  // user2: User | null;
}

export interface Message {
  content: string;
  conversation_id: number;
  created_at: string;
  edited_at: string | null;
  id: number;
  message_uuid: string | null;
  read_at: string | null;
  sender_id: string;
  conversations: Conversation;
}
