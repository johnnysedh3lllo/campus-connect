import { HeaderProps } from "@/lib/prop.types";

export function Header({ title, subTitle, children }: HeaderProps) {
  return (
    <div className="bg-background border-border sticky top-0 z-10 border-b-1">
      <header className="max-w-screen-max-xl mx-auto flex items-center justify-between p-4 pt-6 sm:px-12 sm:pt-10 lg:px-6">
        <section>
          <h1 className="text-2xl leading-10 font-semibold sm:text-4xl sm:leading-11">
            {title}
          </h1>
          <p className="text-text-secondary text-sm leading-6 flex gap-2">{subTitle}</p>
        </section>

        {children}
      </header>
    </div>
  );
}
