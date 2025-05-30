export type ListingImageMetadata = {
  url: string;
  path: string;
  fullPath: string;
  width: number;
  height: number;
};

export type OAuthActionType = "signup" | "login" | null;

export type PasswordStrengthRequirements = {
  score: number;
  criteria: {
    hasChar: boolean;
    hasMinimum: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumbers: boolean;
    hasSpecialChars: boolean;
  };
};
