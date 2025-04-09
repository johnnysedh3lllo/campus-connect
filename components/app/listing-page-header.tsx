import React from "react";
import Image from "next/image";

function ListingPageHeader({
  heading,
  subHeading,
  handleEscape,
}: {
  heading: string;
  subHeading: string;
  handleEscape: () => void;
}) {
  return (
    <header className="border-b px-4 pb-3 sm:px-12 md:mx-20 md:px-0">
      <section className="flex items-center justify-between">
        <div>
          <h1 className="flex w-full items-center justify-between text-2xl leading-10 font-semibold sm:text-4xl sm:leading-11">
            {heading}
          </h1>
          <p className="text-sm text-[#878787]">{subHeading}</p>
        </div>

        <Image
          src={"/icons/icon-close-no-borders.svg"}
          alt="Close Icon"
          width={40}
          height={40}
          className="cursor-pointer"
          onClick={handleEscape}
        />
      </section>
    </header>
  );
}

export default ListingPageHeader;
