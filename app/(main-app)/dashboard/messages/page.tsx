import { Metadata } from "next";
// import Link from "next/link";
// import { redirect } from "next/navigation";
// import { createClient } from "@/utils/supabase/server";
// import { UserResponse } from "@supabase/supabase-js";

export const metadata: Metadata = {
  title: "Messages",
};

export default async function Page() {
  // const supabase = await createClient();

  // const {
  //   data: { user },
  // }: UserResponse = await supabase.auth.getUser();

  // if (!user) {
  //   return redirect("/sign-in");
  // }

  const data = await new Promise((resolve) => {
    setTimeout(() => {
      resolve("Completed");
    }, 3000);
  });

  console.log(data);

  return (
    <>
      <div className="flex h-full gap-4">
        <section className="flex gap-2 flex-col border border-solid border-black flex-[0.325] p-4">
          <h1 className="font-bold">Messages</h1>
          <div>
            <p>Add Chat</p>
          </div>
          <div className="flex-1 overflow-y-auto  border border-solid border-black">
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
            <p>chat</p>
          </div>
        </section>
        <main className="border border-solid border-black flex-[2] flex pt-4 pl-4 pr-4 gap-4 w-full">
          <section className="flex-[2] flex justify-between flex-col gap-4 pl-8 pr-8">
            <div>
              <h2 className="font-bold">John Doe</h2>
              <p>Online</p>
            </div>
            <div className="overflow-y-auto h-full">
              <p className="self-start">messages body</p>
              <p className="self-start">messages body</p>
              <p className="self-start">messages body</p>
              <p className="self-start">messages body</p>
              <p className="self-start">messages body</p>
              <p className="self-start">messages body</p>
              <p className="self-start">messages body</p>
              <p className="self-start">messages body</p>
              <p className="self-start">messages body</p>
              <p className="self-start">messages body</p>
              <p className="self-start">messages body</p>
              <p className="self-start">messages body</p>
              <p className="self-start">messages body</p>
              <p className="self-start">messages body</p>
              <p className="self-start">messages body</p>
              <p className="self-start">messages body</p>
              <p className="self-start">messages body</p>
              <p className="self-start">messages body</p>
              <p className="self-start">messages body</p>
              <p className="self-start">messages body</p>
              <p className="self-start">messages body</p>
              <p className="self-start">messages body</p>
              <p className="self-start">messages body</p>
              <p className="self-start">messages body</p>
              <p className="self-start">messages body</p>
              <p className="self-start">messages body</p>
              <p className="self-start">messages body</p>
              <p className="self-start">messages body</p>
              <p className="self-start">messages body</p>
              <p className="self-start">messages body</p>
              <p className="self-start">messages body</p>
              <p className="self-start">messages body</p>
              <p className="self-start">messages body</p>
              <p className="self-start">messages body</p>
              <p className="self-start">messages body</p>
              <p className="self-start">messages body</p>
              <p className="self-start">messages body</p>
              <p className="self-start">messages body</p>
            </div>

            <form className="p-4 flex gap-2 rounded-t-md border-solid border-black border">
              <input
                placeholder="Type a message..."
                className="p-2 w-full border-solid border-black border rounded-md"
                type="text"
                name=""
                id=""
              />
              <button
                type="submit"
                className="p-2 bg-black text-white rounded-md"
              >
                Send
              </button>
            </form>
          </section>
          {/* <section className="flex-1">
            <p>details menu</p>
          </section> */}
        </main>
      </div>
    </>
  );
}
