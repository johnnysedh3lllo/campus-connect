// Utilities
import { createClient } from "@/utils/supabase/server";
import { UserResponse } from "@supabase/supabase-js";
import MessageContainer from "@/components/message-container";

// Components
import { Suspense } from "react";

export default async function MessagesBodyPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const supabase = await createClient();

  const { conversationId } = await params;

  const {
    data: { user },
  }: UserResponse = await supabase.auth.getUser();

  return (
    <Suspense fallback={<p>Loading....</p>}>
      <MessageContainer conversationId={conversationId} />
    </Suspense>
  );
}
