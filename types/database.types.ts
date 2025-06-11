import {
  Database as DB,
  Enums,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/database.types";

declare global {
  interface Database extends DB {}

  type Listings = Tables<"listings">;
  type ListingsInsert = TablesInsert<"listings">;
  type ListingsUpdate = TablesUpdate<"listings">;

  type ListingImages = Tables<"listing_images">;
  type ListingImagesInsert = TablesInsert<"listing_images">;
  type ListingWithImages = Listings & {
    listing_images: Omit<ListingImages, "created_at" | "listing_uuid">[];
  };
  type ListingPublicationStatus = ListingWithImages["publication_status"];
  type ListingType = ListingWithImages["listing_type"];

  type Messages = Tables<"visible_messages_for_user"> & {
    // Add this to track optimistic updates
    optimisticId?: string; // Temporary client-side ID for tracking
    status?: "optimistic" | "confirmed" | "failed";
  };
  type MessagesInsert = TablesInsert<"messages">;

  type RealMessagesTable = Tables<"messages">;

  type RateLimitEndpointEnum = Enums<"rate_limit_endpoint">;

  type Participant = Pick<
    UserPublic,
    | "id"
    | "first_name"
    | "last_name"
    | "full_name"
    | "role_id"
    | "email"
    | "avatar_url"
  >;

  type ConversationsMain = Tables<"conversations">;
  type Conversations = Tables<"user_conversations">;

  type ConversationsInsert = TablesInsert<"conversations">;

  // TODO[REFACTOR]: USE THIS NEW PATTERN BELOW FOR ALL OTHER DATABASE TYPES
  type UserPublic = Tables<"users">;

  type Credits = Tables<"credits">;
  type CreditsTransactions = Tables<"credit_transactions">;
  type Subscriptions = Tables<"subscriptions">;
  type SubscriptionsInsert = TablesInsert<"subscriptions">;
  type SubscriptionStatus = Tables<"subscriptions">["status"];

  type Packages = Tables<"packages">;

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
      full_name: string | null;
      email: string;
      role_id: number | null;
      about: string | null;
      avatar_url: string | null;
    } | null;
  };

  type ConversationParticipantsUpdate =
    TablesUpdate<"conversation_participants">;

  type Settings = Tables<"settings">;
  type SettingsInsert = TablesInsert<"settings">;
}
