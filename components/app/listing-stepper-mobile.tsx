import { Badge } from "@/components/ui/badge";

interface ListingStepperMobileProps {
  step: number;
  steps: string[];
}

export default function ListingStepperMobile({ step, steps }: ListingStepperMobileProps) {
  return (
    <div className="bg-background sticky top-0 flex gap-1 py-4 sm:hidden lg:pe-4">
      <Badge variant="outline">{`${step + 1}/${steps.length}`}</Badge>
      <div className="grid w-full grid-flow-row grid-cols-4 items-center gap-1">
        {steps.map((_, index) => (
          <div className="bg-accent-secondary h-0.5" key={`step-${index}`}>
            <div
              className={`h-full transition-all duration-500 ${index <= step ? "bg-primary w-full" : "w-0"}`}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}
