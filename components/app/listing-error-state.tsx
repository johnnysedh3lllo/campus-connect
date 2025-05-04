import { AlertTriangleIcon } from "lucide-react";
import { Button } from "../ui/button";

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-background-accent-secondary mb-4 flex h-16 w-16 items-center justify-center rounded-full">
        <AlertTriangleIcon className="text-text-accent h-8 w-8" />
      </div>
      <h2 className="text-text-secondary mb-2 text-xl font-semibold">
        {message}
      </h2>
      {onRetry && <Button onClick={onRetry}>Retry</Button>}
    </div>
  );
}
