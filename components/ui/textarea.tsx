import * as React from "react";

import { cn } from "@/lib/utils/app/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input ring-offset-background bg-background placeholder:text-text-placeholder focus-visible:border-ring/25 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-sm border px-3.5 py-3 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-sm placeholder:leading-6 focus-visible:ring-2 focus-visible:ring-[1px] focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
