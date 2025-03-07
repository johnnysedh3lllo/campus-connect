import React from "react";
import Image from "next/image";

import { PhoneIconFill } from "@/public/icons/phone-icon-fill";
import { EmailIconFill } from "@/public/icons/email-icon-fill";
import { ChatIconFill } from "@/public/icons/chat-icon-fill";
import { InfoCircleIconFill } from "@/public/icons/info-circle-icon-fill";

const items = [
  {
    image: <InfoCircleIconFill />,
    title: "FAQs",
    details: "Find quick answers to the most common questions.",
  },
  {
    image: <ChatIconFill />,
    title: "Live chat",
    details: "Get an immediate support by starting a chat",
  },
  {
    image: <EmailIconFill />,
    title: "Email us",
    details: "Drop us a message via mail, and we’ll respond promptly.",
  },
  {
    image: <PhoneIconFill />,
    title: "Call us",
    details: "Speak directly with our team for immediate assistance",
  },
];
const Support = () => {
  return (
    <section className="space-y-4">
      <h2 className="font-semibold">Help Center</h2>
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex flex-col gap-2 rounded-md border p-4"
          >
            {item.image}
            <h3 className="leading-10 font-semibold sm:leading-11">
              {item.title}
            </h3>
            <span className="text-gray-900">{item.details}</span>
          </div>
        ))}
      </section>
    </section>
  );
};

export default Support;
