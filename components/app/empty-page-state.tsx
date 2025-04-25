import { Button } from "../ui/button";
import Image from "next/image";
import { EmptyPageStateProps } from "@/lib/prop.types";

export function EmptyPageState({
  imageSrc,
  title,
  subTitle,
  buttonText,
  buttonIcon,
  onButtonClick,
  showButton = true,
}: EmptyPageStateProps) {
  return (
    <div className="mx-auto flex max-w-145 flex-col items-center gap-10 sm:gap-12">
      <figure className="mx-auto w-1/2">
        <Image src={imageSrc} alt="" width={300} height={300} />
      </figure>

      <section className="text-center">
        <h1 className="text-2xl leading-10 font-semibold sm:text-4xl sm:leading-11">
          {title}
        </h1>
        <p className="text-text-secondary text-sm leading-6">{subTitle}</p>
      </section>

      {showButton && buttonText && (
        <Button
          onClick={onButtonClick}
          className="h-full w-fit cursor-pointer gap-3 px-7.5 py-3 text-base leading-6 sm:flex"
        >
          <p>{buttonText} </p>
          {buttonIcon}
        </Button>
      )}
    </div>
  );
}
