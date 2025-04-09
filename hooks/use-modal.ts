"use client";
import { useState } from "react";

export function useModal() {
  const [modalData, setModalData] = useState<{
    open: boolean;
    variant: "success" | "error";
    title?: string;
    message?: string;
    primaryButtonText?: string;
    secondaryButtonText?: string;
    onPrimaryAction?: () => void;
    onSecondaryAction?: () => void;
  }>({
    open: false,
    variant: "success",
  });

  function openModal(data: Partial<typeof modalData>) {
    setModalData({ ...modalData, ...data, open: true });
  }

  function closeModal() {
    setModalData({ ...modalData, open: false });
  }

  return { modalData, openModal, closeModal };
}
