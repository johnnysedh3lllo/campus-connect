import { addMessage } from "@/app/actions";
import MessageContainer from "@/components/message-container";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
// import Link from "next/link";
// import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { UserResponse } from "@supabase/supabase-js";

export const metadata: Metadata = {
  title: "Messages",
};

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
  }: UserResponse = await supabase.auth.getUser();

  // if (!user) {
  //   return redirect("/sign-in");
  // }

  // const data = await new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve("Completed");
  //   }, 3000);
  // });

  // console.log(data);

  return <MessageContainer userId={user?.id} />;
}
