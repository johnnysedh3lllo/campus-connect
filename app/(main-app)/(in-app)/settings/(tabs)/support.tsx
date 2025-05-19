import React from "react";

import { PhoneIconFill } from "@/public/icons/phone-icon-fill";
import { EmailIconFill } from "@/public/icons/email-icon-fill";
import { InfoCircleIconFill } from "@/public/icons/info-circle-icon-fill";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const items = [
  {
    image: <InfoCircleIconFill />,
    title: "FAQs",
    details: "Find quick answers to the most common questions.",
    link: "#",
  },
  {
    image: <EmailIconFill />,
    title: "Email us",
    details: "Drop us a message via mail, and we’ll respond promptly.",
    link: "#",
  },
  {
    image: <PhoneIconFill />,
    title: "Call us",
    details: "Speak directly with our team for immediate assistance.",
    link: "#",
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
          <Link key={item.title} href={item.link} className="group">
            <Card className="border-border flex flex-col gap-2 rounded-md border p-4 transition-all duration-150 group-hover:shadow-lg">
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
          </Link>
        ))}
      </section>
    </section>
  );
}
