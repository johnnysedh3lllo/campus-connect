import { useState } from "react";
import { Input } from "../ui/input";
import { Eye, EyeOff } from "lucide-react";
import { PasswordInputProps } from "@/lib/prop.types";
import { useShowPasswordState } from "@/lib/store/password-visibility-store";

export function PasswordInput({ field, ...props }: PasswordInputProps) {
  const { showPassword, setShowPassword } = useShowPasswordState();

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        required
        {...field}
        {...props}
      />
      <button
        type="button"
        className="text-primary hover:text-muted absolute inset-y-0 right-0 flex items-center pr-3"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
