import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
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

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <>
      <div className="flex h-full gap-4 border-solid border-black border">
        <section className="flex-1 p-4">
          <h1 className="font-bold">Messages</h1>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
        </section>
        <main className="flex p-4 gap-4 w-full">
          <section className="flex-[2]">
            <p>messages body</p>

            <section className=" border-solid border-black border">
              <input type="text" name="" id="" />
            </section>
          </section>
          <section className="flex-1">
            <p>details menu</p>
          </section>
        </main>
      </div>
    </>
  );
}
