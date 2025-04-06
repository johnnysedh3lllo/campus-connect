import React from "react";
import { ShieldIcon } from "@/public/icons/shield-icon";
import { Button } from "../ui/button";

function CreateSuccessModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed top-0 left-0 flex h-full w-screen items-center justify-center bg-black/20 p-4">
      {/* <div className="h-8 w-full rounded-lg bg-white"></div> */}
      <div className="mx-auto flex w-full flex-col items-center justify-center gap-6 rounded-lg bg-white p-4 lg:max-w-120">
        <div className="border-foreground w-fit self-center rounded-full border-1 border-solid p-4">
          <figure className="flex size-50 items-center justify-center rounded-full bg-green-200">
            <ShieldIcon />
          </figure>
        </div>

        <div className="flex flex-col">
          <h1 className="text-center text-xl leading-7.5 font-semibold sm:leading-11">
            Property listed successfully
          </h1>
          <p className="text text-secondary-foreground text-center text-sm">
            200 credits have been deducted from your balance, Now sit back and
            let a tenant make an inquiry
          </p>
        </div>

        {/* <form action={signOut}> */}
        <Button
          className="w-full cursor-pointer text-base leading-6 font-semibold"
          onClick={onClose}
        >
          Back to listings
        </Button>
        {/* </form> */}
      </div>
    </div>
  );
}

export default CreateSuccessModal;
