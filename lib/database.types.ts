import {
  Database as DB,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/database.types";

declare global {
  interface Database extends DB {}

  type Message = DB["public"]["Tables"]["messages"]["Row"] & {
    // Add this to track optimistic updates
    optimisticId?: string; // Temporary client-side ID for tracking
    status?: "optimistic" | "confirmed" | "failed";
  };

  type Participant = Pick<
    DB["public"]["Tables"]["users"]["Row"],
    "id" | "first_name" | "last_name" | "role_id" | "email"
  >;

  type Messages = Tables<"messages">;

  type Conversations = {
    conversation_id: DB["public"]["Tables"]["conversations"]["Row"]["id"];
    created_at: DB["public"]["Tables"]["conversations"]["Row"]["created_at"];
    deleted_at: DB["public"]["Tables"]["conversations"]["Row"]["deleted_at"];
    updated_at: DB["public"]["Tables"]["conversations"]["Row"]["updated_at"];
    last_message: Messages["content"];
    last_message_sender_id: Messages["sender_id"];
    last_message_sent_at: Messages["created_at"];
    unread_count: number; // TODO: revisit and properly type this.
    participants: Participant[];
  };

  type ConvoParticipant = {
    conversation_id: string;
    created_at: string | null;
    user_id: string;
    users: {
      first_name: string | null;
      last_name: string | null;
      email: string;
    } | null;
  };

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
  type ConversationParticipantsUpdate =
    TablesUpdate<"conversation_participants">;
}
