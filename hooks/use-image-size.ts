import { useEffect, useState } from "react";

export function useImageSize(url: string) {
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null,
  );

  useEffect(() => {
    if (!url) return;
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setSize({ width: img.width, height: img.height });
    };
  }, [url]);

  return size;
}
