export type ConversationLIstInfiniteQueryKeys = readonly [
  "conversationsInfinite",
  string | undefined,
  string,
];
export type ConversationMessagesQueryKeys = readonly [
  "conversations",
  "messages",
  string,
  string,
];
export const queryKeys = {
  user: {
    main: ["user"] as const,
    public: (userId: string | undefined) => ["userPublic", userId] as const,
    settings: ["userSettings"],
  },

  credits: (userId: string | undefined) => ["userCredits", userId] as const,
  packages: (userId: string | undefined) => ["package", userId] as const,
  subscription: (userId: string | undefined) =>
    ["activeSubscription", userId] as const,

  conversations: {
    list: (userId: string | undefined, searchTerm: string | undefined) =>
      ["conversations", userId, searchTerm ?? ""] as const,
    listInfinite: (
      userId: string | undefined,
      searchTerm: string | undefined,
    ): ConversationLIstInfiniteQueryKeys =>
      ["conversationsInfinite", userId, searchTerm ?? ""] as const,
    participants: (userId: string, conversationId: string) =>
      ["conversations", "participants", userId, conversationId] as const,
    messages: (conversationId: string, userId: string) =>
      ["conversations", "messages", conversationId, userId] as const,
  },

  listings: {
    all: ["listings"] as const,
    byStatus: (
      status: "published" | "unpublished" | "draft",
      userId: string | undefined,
      searchTerm: string | undefined,
    ) => ["listings", userId ?? "public", status, searchTerm ?? ""] as const,
    byStatusInfinite: (
      status: "published" | "unpublished" | "draft",
      userId: string | undefined,
      searchTerm: string | undefined,
    ) =>
      [
        "listingsInfinite",
        userId ?? "public",
        status,
        searchTerm ?? "",
      ] as const,
    byId: (listingId: string) => ["listings", listingId] as const,
  },
};
