"use client";

import { CheckIcon } from "@/public/icons/check-icon";
import { PasswordStrengthRequirements } from "@/types/config.types";

export function PasswordRequirements({
  score,
  criteria,
}: PasswordStrengthRequirements) {
  const requirements: { isMet: boolean; text: string }[] = [
    { isMet: criteria.hasChar, text: "Must not be empty" },
    { isMet: criteria.hasMinimum, text: "At least 8 characters long" },
    {
      isMet: criteria.hasLowercase,
      text: "At least one lowercase letter (a–z)",
    },
    {
      isMet: criteria.hasUppercase,
      text: "At least one uppercase letter (A–Z)",
    },
    {
      isMet: criteria.hasNumbers,
      text: "At least one number (0–9)",
    },
    {
      isMet: criteria.hasSpecialChars,
      text: "At least one special character",
    },
  ];

  return (
    <div className="bg-foreground/5 flex flex-col gap-2 rounded-sm p-4 text-black">
      <section>
        <h3 className="text-sm">Strength</h3>
        <div className="bg-foreground/10 rounded-md text-sm">
          <div
            className="bg-alert-success-primary h-1 rounded-md transition-all duration-100"
            style={{
              width: `${score * 16.67}%`,
            }}
          ></div>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-medium">Password Requirements</h3>
        <ul className="text-xs">
          {requirements.map((required) => (
            <li
              key={required.text}
              className={`${required.isMet ? "text-alert-success-primary" : ""} flex items-center gap-0.5`}
            >
              <CheckIcon
                className={`size-3 ${required.isMet ? "opacity-100" : "opacity-0"}`}
              />
              <p>{required.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
