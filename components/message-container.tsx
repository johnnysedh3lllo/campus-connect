"use client";
import { v4 as uuidv4 } from "uuid";

import React, { useEffect, useState } from "react";
import { SubmitButton } from "./submit-button";
import { Button } from "./ui/button";
import { addMessage } from "@/app/actions";

interface MessageContainerProps {
  userId: string | undefined;
}

interface Message {
  sender: string;
  text: string;
}

let storedMessages = [] as Message[];

const MessageContainer: React.FC<MessageContainerProps> = ({ userId }) => {
  interface FormEvent extends React.FormEvent<HTMLFormElement> {}

  // Removed incorrect InputEvent interface
  const [messageText, setMessageText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatId = "68cd17e8-315f-4f1b-a650-0bec87572cf6";

  const senderId = userId;
  const receiverId = "b38596d9-48d6-4e29-81aa-036d4f4ae987";

  storedMessages = JSON.parse(localStorage.getItem(chatId) as string) || []; // first checking for previous messages. if none, return empty array
  // console.log(userId);
  console.log("uuid:", uuidv4());

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();

    // // TODO: GET SENT MESSAGE
    const formData = new FormData(e.target as HTMLFormElement);
    const message = formData.get("message");

    // // TODO: STORE MESSAGE SOMEWHERE OR LOG TO CONSOLE
    // ?: HOW DO YOU STORE MESSAGES IN LOCAL STORAGE
    storedMessages.push({ sender: senderId, text: message } as Message);
    localStorage.setItem(chatId, JSON.stringify(storedMessages));

    // // TODO: SET TYPING TO FALSE AND CLEAR TEXT INPUT FIELD
    setIsTyping(false);
    setMessageText("");

    // TODO: GET AND DISPLAY MESSAGES IN CHAT

    // Retrieve messages
    storedMessages = JSON.parse(localStorage.getItem(chatId) as string) || [];
    console.log("Retrieved Messages for Chat ID:", storedMessages);
  };

  // to handle the "Typing..." mechanism
  useEffect(() => {
    if (messageText === "") return; // Skip the effect if input is empty

    setIsTyping(true);

    const timeout = setTimeout(() => {
      setIsTyping(false);
      setMessageText(messageText);
    }, 500); // Delay to simulate the user "stopping typing" after 2 seconds of inactivity

    // This cleanup function will run at the beginning of every render (except the first one),
    // before the effect code executes again, to clear any previously set timeouts.
    return () => {
      clearTimeout(timeout);
    };
  }, [messageText]); // The effect re-runs every time messageText changes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTyping(true);
    setMessageText(e.target.value);
  };

  return (
    <div className="flex h-full gap-4">
      <section className="flex gap-2 flex-col border border-solid border-black flex-[0.325] p-4">
        <h1 className="font-bold">Messages</h1>
        <div>
          <Button variant="outline">Add Chat</Button>
        </div>
        <div className="flex-1 overflow-y-auto  border border-solid border-black p-4 w-full">
          <p className="text-ellipsis overflow-hidden whitespace-nowrap">
            chat
          </p>
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
          <div className="overflow-y-auto h-full flex flex-col gap-2">
            <div className="overflow-y-auto scroll-smooth h-full flex flex-col gap-2 [scrollbar-width:_none]">
              {storedMessages.map((message: Message, index) => {
                return (
                  <div
                    className={`p-2 rounded w-fit bg-primary ${message.sender !== userId ? "self-start" : "self-end"} text-white`}
                    key={index}
                  >
                    <p>{message.text}</p>
                  </div>
                );
              })}
            </div>
            {isTyping ? (
              <p
                className={`italic ${userId === senderId ? "self-end" : "self-start"}`}
              >
                Typing...
              </p>
            ) : (
              ""
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-4 flex gap-2 rounded-t-md border-solid border-black border"
          >
            <input
              placeholder="Type a message..."
              className="p-2 w-full border-solid border-black border rounded-md"
              type="text"
              onChange={handleChange}
              value={messageText}
              name="message"
              id="message"
            />

            <SubmitButton pendingText="Sending...">Send</SubmitButton>
          </form>
        </section>
        {/* <section className="flex-1">
            <p>details menu</p>
          </section> */}
      </main>
    </div>
  );
};

export default MessageContainer;
