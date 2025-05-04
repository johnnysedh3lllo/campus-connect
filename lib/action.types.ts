export type InsertListingResult = {
  success: boolean;
  message: string;
  listingId?: string;
  error?: string;
};

export type CheckPremiumStatusResult = {
  success: boolean;
  isPremium?: boolean;
  error?: string;
};
export type UpdateListingResult = {
  success: boolean;
  message: string;
  error?: string;
};
export type PublicationResult = {
  success: boolean;
  message: string;
  error?: string;
};
