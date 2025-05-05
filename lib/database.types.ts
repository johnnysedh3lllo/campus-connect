import {
  Database as DB,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/database.types";

declare global {
  interface Database extends DB {}

  type Messages = Tables<"visible_messages_for_user"> & {
    // Add this to track optimistic updates
    optimisticId?: string; // Temporary client-side ID for tracking
    status?: "optimistic" | "confirmed" | "failed";
  };
  type MessagesInsert = TablesInsert<"messages">;

  type RealMessagesTable = Tables<"messages">;

  type Participant = Pick<
    UserPublic,
    "id" | "first_name" | "last_name" | "role_id" | "email" | "avatar_url"
  >;

  type ConversationsMain = Tables<"conversations">;
  type Conversations = {
    conversation_id: ConversationsMain["id"];
    created_at: ConversationsMain["created_at"];
    deleted_at: ConversationsMain["deleted_at"];
    updated_at: ConversationsMain["updated_at"];
    last_message: Messages["content"];
    last_message_sender_id: Messages["sender_id"];
    last_message_sent_at: Messages["created_at"];
    unread_count: number; // TODO: revisit and properly type this.
    participants: Participant[];
  };
  type ConversationsInsert = TablesInsert<"conversations">;

  // TODO[REFACTOR]: USE THIS NEW PATTERN BELOW FOR ALL OTHER DATABASE TYPES
  type UserPublic = Tables<"users">;
  type Credits = Tables<"credits">;
  type CreditsTransactions = Tables<"credit_transactions">;
  type Subscriptions = Tables<"subscriptions">;
  type SubscriptionsInsert = TablesInsert<"subscriptions">;
  type SubscriptionStatus = Tables<"subscriptions">["status"];

  type Customers = Tables<"customers">;
  type CustomersInsert = TablesInsert<"customers">;

  type ConversationParticipants = Tables<"conversation_participants">;

  type ConvoParticipant = {
    conversation_id: string;
    created_at: string | null;
    user_id: string;
    users: {
      first_name: string | null;
      last_name: string | null;
      email: string;
      role_id: number;
      about: string | null;
      avatar_url: string | null;
    } | null;
  };

  type ConversationParticipantsUpdate =
    TablesUpdate<"conversation_participants">;
}
