import { HeaderProps } from "@/types/prop.types";
import { cn } from "@/lib/utils/app/utils";

export function Header({
  title,
  subTitle,
  subTitleIcon,
  children,
  className,
}: HeaderProps) {
  return (
    <div className="bg-background border-border sticky -top-[1px] z-10 border-b-1">
      <header
        className={cn(
          "max-w-screen-max-xl mx-auto flex items-center justify-between p-4 pt-6 sm:px-12 sm:pt-10 lg:px-6",
          className,
        )}
      >
        <section>
          <h1 className="text-2xl leading-10 font-semibold sm:text-4xl sm:leading-11">
            {title}
          </h1>
          <p className="text-text-secondary flex gap-2 text-sm leading-6">
            {subTitleIcon} {subTitle}
          </p>
        </section>

        {children}
      </header>
    </div>
  );
}
