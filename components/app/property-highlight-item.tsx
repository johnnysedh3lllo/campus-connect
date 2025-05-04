import { PropertyHighlightItemProps } from "@/lib/prop.types";

export function PropertyHighlightItem({ icon, label, value }: PropertyHighlightItemProps) {
  return (
    <div className="border-b border-line last:border-b-0 flex items-center gap-4 p-4">
      <span className="flex h-8 w-8 items-center justify-center rounded-full ">
        {icon}
      </span>
      <div className="flex flex-col">
        <span className="text-sm text-text-secondary leading-6">{label}</span>
        <span className="text-lg font-medium text-text-primary leading-6">{value}</span>
      </div>
    </div>
  );
}
