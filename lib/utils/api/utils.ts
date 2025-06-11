import { ROLES, SITE_CONFIG } from "@/lib/config/app.config";
import { PURCHASE_TYPES } from "@/lib/config/pricing.config";
import { PurchaseFormType } from "@/types/form.types";

// Retry logic with exponential backoff
export async function retryWithBackoff<T>({
  fn,
  maxRetries = 3,
}: {
  fn: () => Promise<T>;
  maxRetries?: number;
}): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      console.warn(
        `Retry attempt ${attempt} of ${maxRetries} failed: ${lastError.message}`,
      );

      if (attempt === maxRetries - 1) break;

      const delay =
        Math.pow(2, attempt) * SITE_CONFIG.EXPONENTIAL_BACKOFF_RETRY_DELAY;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

export function validateRolePermission(
  userRoleId: number,
  purchaseType: PurchaseFormType["purchaseType"],
): boolean {
  switch (purchaseType) {
    case PURCHASE_TYPES.LANDLORD_CREDITS.type:
    case PURCHASE_TYPES.LANDLORD_PREMIUM.type:
      return userRoleId === ROLES.LANDLORD;
    case PURCHASE_TYPES.STUDENT_PACKAGE.type:
      return userRoleId === ROLES.TENANT;
    default:
      return false;
  }
}
