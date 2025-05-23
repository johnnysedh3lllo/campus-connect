import { EmptyPageStateProps } from "@/types/prop.types";
import Image from "next/image";

export function EmptyPageState({
  imageSrc,
  title,
  subTitle,
  button,
}: EmptyPageStateProps) {
  return (
    <div className="mx-auto flex max-w-145 flex-col items-center gap-10 sm:gap-12">
      <figure className="mx-auto w-1/2">
        {/* TODO: PASS THE WIDTH AND HEIGHT HERE */}
        <Image src={imageSrc} alt="" width={300} height={300} />
      </figure>

      <section className="text-center">
        <h1 className="text-2xl leading-10 font-semibold sm:text-4xl sm:leading-11">
          {title}
        </h1>
        <p className="text-text-secondary text-sm leading-6">{subTitle}</p>
      </section>

      {button && button}
    </div>
  );
}
