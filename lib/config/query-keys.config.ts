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
    list: (userId: string | undefined) => ["conversations", userId] as const,
    participants: (userId: string, conversationId: string) =>
      ["conversations", "participants", userId, conversationId] as const,
    messages: (conversationId: string, userId: string) =>
      ["conversations", "messages", conversationId, userId] as const,
  },

  listings: {
    all: ["listings"] as const,
    published: (userId: string | undefined) =>
      ["listings", userId ?? "public", "published"] as const,
    unpublished: (userId: string | undefined) =>
      ["listings", userId, "unpublished"] as const,
    drafts: (userId: string | undefined) =>
      ["listings", userId, "draft"] as const,
    byId: (listingId: string) => ["listings", listingId] as const,
  },
};
