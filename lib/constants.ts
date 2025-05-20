export const MIN_CREDITS = 20;
export const MIN_INQUIRIES = 1;
// IMAGE UPLOADS
export const SUPPORTED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_LISTING_IMAGES = 10;

export const MIN_PROFILE_IMAGE_SIZE = 1 * 1024 * 512; // 500KB
export const MAX_PROFILE_IMAGE_SIZE = 1 * 1024 * 1024; // 500KB

export const MIN_LISTING_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB
export const MAX_LISTING_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB
export const MAX_TOTAL_LISTING_IMAGE_SIZE =
  MAX_LISTING_IMAGE_SIZE * MAX_LISTING_IMAGES;

export const DEFAULT_STALE_TIME = 1000 * 60 * 5;
