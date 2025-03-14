import React from "react";
import Image from "next/image";

import { PhoneIconFill } from "@/public/icons/phone-icon-fill";
import { EmailIconFill } from "@/public/icons/email-icon-fill";
import { ChatIconFill } from "@/public/icons/chat-icon-fill";
import { InfoCircleIconFill } from "@/public/icons/info-circle-icon-fill";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const items = [
  {
    image: <InfoCircleIconFill />,
    title: "FAQs",
    details: "Find quick answers to the most common questions.",
  },
  // {
  //   image: <ChatIconFill />,
  //   title: "Live chat",
  //   details: "Get an immediate support by starting a chat",
  // },
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

export default function Support() {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-text-primary text-base leading-6 font-semibold">
        Help Center
      </h2>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {items.map((item) => (
          <Card
            key={item.title}
            className="border-border flex flex-col gap-2 rounded-md border p-4"
          >
            {item.image}

            <CardContent className="flex flex-col gap-1 p-0">
              <h3 className="text-text-primary text-base leading-6 font-semibold">
                {item.title}
              </h3>
              <p className="text-text-secondary text-sm leading-6 font-medium">
                {item.details}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
    </section>
  );
}
