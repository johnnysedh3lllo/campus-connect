"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BinStrokeIcon } from "@/public/icons/bin-stroke-icon";

interface PhotoPreviewProps {
  url: string;
  onRemove?: () => void;
}

export function PhotoPreview({ url, onRemove }: PhotoPreviewProps) {
  const handleRemove = (e: any) => {
    if (onRemove) {
      e.stopPropagation();
      onRemove();
    }
    return;
  };
  return (
    <div className="relative h-full overflow-hidden rounded-md border">
      <div className="relative aspect-square">
        <Image
          src={url || "/placeholder.svg"}
          alt="Property photo"
          fill
          className="object-cover"
        />
      </div>
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="bg-background-secondary text-primary border-background-accent/50 absolute top-2 right-2 size-8 border"
        onClick={handleRemove}
      >
        <BinStrokeIcon />
      </Button>
    </div>
  );
}
