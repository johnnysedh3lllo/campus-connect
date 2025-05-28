export const MIN_CREDITS = 20;
export const MIN_INQUIRIES = 1;
// IMAGE UPLOADS
export const SUPPORTED_FILE_TYPES = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/webp",
];
export const MAX_LISTING_IMAGES = 10;

export const MIN_LISTING_IMAGE_WIDTH = 1200;
export const MAX_LISTING_IMAGE_WIDTH = 2400;

export const MIN_LISTING_IMAGE_HEIGHT = 800;
export const MAX_LISTING_IMAGE_HEIGHT = 1600;

export const LISTING_IMAGE_ASPECT_RATIO = 1.5;
export const ASPECT_RATIO_TOLERANCE = 0.01;

export const MIN_PROFILE_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB
export const MAX_PROFILE_IMAGE_SIZE = 1 * 1024 * 2048; // 500KB

export const MIN_LISTING_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB
export const MAX_LISTING_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB
export const MAX_TOTAL_LISTING_IMAGE_SIZE =
  MAX_LISTING_IMAGE_SIZE * MAX_LISTING_IMAGES;

export const DEFAULT_STALE_TIME = 1000 * 60 * 5;
