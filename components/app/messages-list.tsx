import { User } from "@supabase/supabase-js";
import { getUserConversationsWithParticipants, getUser } from "@/app/actions";
import Link from "next/link";
import { SearchBar } from "./search-bar";
import { ScrollArea } from "../ui/scroll-area";
import { useConversations } from "@/hooks/use-get-conversations";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { MessagesListItem } from "./messages-list-item";

// interface MessagesListProps {
//   selectedChat: string | null;
//   isDesktop: boolean;
//   handleChatSelect: (id: string) => void;
//   //   userConversations: Conversations[] | undefined;
// }

export function MessagesList() {
  //   const userConversations = await getUserConversationsWithParticipants();

  const {
    conversations: userConversations,
    loading,
    error,
    refetch,
  } = useConversations();

  //   if (loading) return <div className="h-full">Loading conversations...</div>;
  //   if (error) return <div>Error: {error}</div>;

  //   ${isDesktop ? "w-80" : "w-full"}
  // ${selectedChat && !isDesktop ? "hidden" : "flex flex-col"}

  return (
    <section
      className={`bg-background flex flex-[0.325] flex-col gap-6 px-4 pt-6 sm:px-6`}
    >
      <header className="flex flex-col gap-3">
        <h1 className="text-2xl leading-8 font-semibold lg:text-4xl lg:leading-11">
          Messages
        </h1>

        <SearchBar />
      </header>

      {/* <ScrollArea className="w-full flex-1 gap-4"> */}
      <div className="flex w-full flex-1 flex-col gap-4 overflow-y-auto">
        {userConversations && userConversations.length > 0 ? (
          <>
            {userConversations.map((conversation) => {
              const { conversation_id: id, participants } =
                conversation as Conversations;

              return (
                <MessagesListItem
                  key={conversation.conversation_id}
                  id={id}
                  participants={participants}
                />
              );
            })}
          </>
        ) : loading ? (
          <p>Loading conversations</p>
        ) : (
          <p className="italic">No conversations to display</p>
        )}
      </div>
      {/* </ScrollArea> */}
    </section>
  );
}
