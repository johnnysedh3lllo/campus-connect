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
    byStatus: (
      status: "published" | "unpublished" | "draft",
      userId: string | undefined,
      searchTerm: string | undefined,
    ) => ["listings", userId ?? "public", status, searchTerm ?? "none"] as const,
    byId: (listingId: string) => ["listings", listingId] as const,

    // to be removed
    published: (userId: string | undefined, searchTerm: string | undefined) =>
      [
        "listings",
        userId ?? "public",
        "published",
        searchTerm ?? "none",
      ] as const,
    unpublished: (userId: string | undefined, searchTerm: string | undefined) =>
      ["listings", userId, "unpublished", searchTerm ?? "none"] as const,
    drafts: (userId: string | undefined, searchTerm: string | undefined) =>
      ["listings", userId, "draft", searchTerm ?? "none"] as const,
  },
};
