"use client";

import { useEffect, useState } from "react";

export const useCountdownTimer = (initialTime: number) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const resetTimer = () => setTimeLeft(initialTime);

  return { timeLeft, resetTimer };
};
