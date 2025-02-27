import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const SuccessStep: React.FC = () => (
  <div className="mx-auto flex w-full flex-col items-center justify-center gap-7  lg:max-w-120">
    <div className="self-center">
      <div className="flex aspect-square h-40 items-center justify-center rounded-full border border-green-400">
        <div className="flex aspect-square h-35 items-center justify-center rounded-full bg-[#56B56A1A]">
          <Image
            src="/icons/icon-shield.svg"
            alt="Envelope icon"
            width={52}
            height={52}
            className="aspect-square w-18"
          />
        </div>
      </div>
    </div>
    <div className="flex flex-col gap-2">
      <h1 className="text-xl leading-7.5 font-semibold sm:text-4xl sm:leading-11">
        Password Changed!
      </h1>
      <p className="text text-secondary-foreground text-sm">
        Your password has been successfully changed. Please use your new
        password when logging in
      </p>
    </div>
    <Button
      onClick={() => (window.location.href = "/log-in")}
      className="w-full cursor-pointer p-6 text-base leading-6 font-semibold"
    >
      Continue to Login
    </Button>
  </div>
);
export default SuccessStep;
