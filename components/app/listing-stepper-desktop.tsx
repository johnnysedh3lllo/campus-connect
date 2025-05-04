import { Separator } from "@/components/ui/separator";

interface ListingStepperDesktopProps {
  step: number;
  steps: string[];
}

export default function ListingStepperDesktop({ step, steps }: ListingStepperDesktopProps) {
  return (
    <div className="hidden auto-cols-auto grid-flow-col items-center gap-3 sm:grid md:grid-flow-row md:auto-rows-auto md:items-start content-start">
      {steps.map((item, index) => (
        <div
          key={index}
          className="grid auto-cols-auto grid-flow-col items-center gap-3 md:grid-flow-row md:items-start md:self-start"
        >
          <div className="grid grid-flow-col items-center gap-3 md:justify-start">
            <span
              className={`bg-line inline-grid aspect-square w-7 place-items-center rounded-full ${
                step === index &&
                "border-primary text-primary border bg-transparent"
              } ${step > index && "bg-primary text-white"}`}
            >
              {index + 1}
            </span>
            <span
              className={`text-text-secondary ${step === index && "text-text-primary! font-semibold"}`}
            >
              {item}
            </span>
          </div>
          {index !== steps.length - 1 && (
            <Separator className={`${step  > index ? "bg-accent-secondary":"bg-line"} h-[2px] w-10 md:h-10 md:w-[2px] md:translate-x-3`} />
          )}
        </div>
      ))}
    </div>
  );
}
