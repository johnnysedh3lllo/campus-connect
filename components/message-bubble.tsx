// interface Message {
//   content: string;
//   conversation_id: number;
//   created_at: string;
//   edited_at: string | null;
//   id: number;
//   message_uuid: string | null;
//   read_at: string | null;
//   sender_id: string;
// }

export default function MessageBubble({
  messageText,
}: {
  messageText: string;
}) {
  return (
    <div className={`p-2 rounded w-fit bg-primary self-end text-white`}>
      <p>{messageText}</p>
    </div>
  );
}
