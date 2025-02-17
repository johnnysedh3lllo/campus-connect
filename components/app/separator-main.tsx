"use strict";

import { Separator } from "../ui/separator";

export function SeparatorMain() {
  return (
    <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center justify-center gap-2">
      <Separator className="bg-line" />
      <p>or</p>
      <Separator />
    </div>
  );
}
