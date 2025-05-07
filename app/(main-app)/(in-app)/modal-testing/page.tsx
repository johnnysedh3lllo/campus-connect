"use client";

import { Modal } from "@/components/app/modal";
import { Button } from "@/components/ui/button";
import { BinIcon } from "@/public/icons/bin-icon";

export default function Page() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div>
        <Modal
          modalId="welcome"
          triggerButton={
            <Button className="flex w-full flex-1 items-center">Open</Button>
          }
          title="Test Title"
          description="This is a test description used to handle multiple edge cases for during modal creation"
          modalImage={<BinIcon />}
          showCloseButton
          modalActionButton={<ArbitraryAction />}
          clearParamAfterOpen
        />
      </div>
    </div>
  );
}

export function ArbitraryAction() {
  const exampleAction = () => console.log("doing something");
  return (
    <Button onClick={exampleAction} className="flex w-full flex-1 items-center">
      Modal Action
    </Button>
  );
}
