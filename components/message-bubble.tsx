import { Message } from "@/lib/types";

export default function MessageBubble({
  userId,
  message,
}: {
  userId: string | undefined;
  message: Message;
}) {
  return (
    <div
      className={`p-2 rounded w-fit bg-primary max-w-[49%]  ${userId === message.sender_id ? "self-end" : "self-start"} text-white`}
    >
      <p>{message.content}</p>
    </div>
  );
}
