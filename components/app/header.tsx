import { Button } from "../ui/button";
import { HeaderProps } from "@/lib/component-prop-types";



export function Header({
  title,
  subTitle,
  buttonText,
  buttonIcon,
  onButtonClick,
  showButton = true,
}: HeaderProps) {
  return (
    <div className="sticky top-0 bg-background border-border border-b-1 z-6">
      <header className="max-w-screen-max-xl mx-auto flex items-center justify-between p-4 pt-6 sm:px-12 sm:pt-10">
        <section>
          <h1 className="text-2xl leading-10 font-semibold sm:text-4xl sm:leading-11">
            {title}
          </h1>
          <p className="text-text-secondary text-sm leading-6">{subTitle}</p>
        </section>

        {showButton && buttonText && (
          <Button
            onClick={onButtonClick}
            className="hidden h-full cursor-pointer gap-3 px-7.5 py-3 text-base leading-6 sm:flex"
          >
            <p>{buttonText} </p>
            {buttonIcon}
          </Button>
        )}
      </header>
    </div>
  );
}
