import React from "react";
import { SubmitButton } from "./submit-button";
// import { addMessage } from "@/app/actions";

interface MessageInputProps {
  messageInputValue: string;
  setMessageInputValue: (value: string) => void;
}

export default function MessageInput({
  messageInputValue,
  setMessageInputValue,
}: MessageInputProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!messageInputValue.trim()) return;
    setMessageInputValue("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInputValue(e.target.value);
  };

  return (
    <form
      // action={addMessage}
      onSubmit={handleSubmit}
      className="p-4 flex gap-2 rounded-t-md border-solid border-black border"
    >
      <input
        placeholder="Type a message..."
        className="p-2 w-full border-solid border-black border rounded-md"
        type="text"
        name="message"
        autoComplete="off"
        id="message"
        value={messageInputValue}
        onChange={handleChange}
      />

      <SubmitButton disabled={!messageInputValue.trim()}>Send</SubmitButton>
    </form>
  );
}
