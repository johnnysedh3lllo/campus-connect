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

const MessageContainer: React.FC<MessageContainerProps> = ({ userId }) => {
  interface FormEvent extends React.FormEvent<HTMLFormElement> {}

  // Removed incorrect InputEvent interface
  const chatId = "68cd17e8-315f-4f1b-a650-0bec87572cf6";
  const [messageText, setMessageText] = useState("");
  const [chatMessages, setChatMessages] = useState(() => {

    // the window obj may not be mounted when the page loads
    // so this checks 
    if (typeof window !== "undefined") {
      const storedMsgs = localStorage.getItem(chatId);
      return storedMsgs ? JSON.parse(storedMsgs) : [];
    }
    return [];
  });
  const [isTyping, setIsTyping] = useState(false);

  const senderId = userId;
  const receiverId = "b38596d9-48d6-4e29-81aa-036d4f4ae987";

  useEffect(() => {
    if (chatMessages.length > 0) {
      localStorage.setItem(chatId, JSON.stringify(chatMessages));
    }
  }, [chatMessages, chatId]);

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();

    if (!messageText) return; // to prevent sending empty text

    const newMessage = { sender: senderId, text: messageText } as Message;

    setChatMessages((prevMessage: Message[]) => [...prevMessage, newMessage]);
    setIsTyping(false);
    setMessageText("");
  };

  // to handle the "Typing..." mechanism
  useEffect(() => {
    if (!messageText) {
      setIsTyping(false);
      return;
    } // Skip the effect if input is empty

    setIsTyping(true);
    const timeout = setTimeout(() => {
      setIsTyping(false);
    }, 500); // Delay to simulate the user "stopping typing" after 2 seconds of inactivity

    // This cleanup function will run at the beginning of every render (except the first one),
    // before the effect code executes again, to clear any previously set timeouts.
    return () => {
      clearTimeout(timeout);
    };
  }, [messageText]); // The effect re-runs every time messageText changes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
              {chatMessages &&
                chatMessages.map((message: Message, index: number) => {
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
              autoComplete="off"
              id="message"
            />

            <SubmitButton disabled={!messageText} pendingText="Sending...">
              Send
            </SubmitButton>
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
