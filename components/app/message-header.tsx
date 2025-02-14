"use client";
interface MessageHeaderProps {
  chatParticipants: ConvoParticipant[] | undefined;
}

export default function MessageHeader({
  chatParticipants,
}: MessageHeaderProps) {
  const chatName =
    chatParticipants && chatParticipants.length === 1
      ? `${chatParticipants[0].profiles?.first_name} ${chatParticipants[0].profiles?.last_name}`
      : "";

  return (
    <div className="flex flex-col p-4 border-b">
      <h2 className="font-bold text-lg">{chatName}</h2>
      <p className="text-sm text-gray-500">Online</p>
    </div>
  );
}
