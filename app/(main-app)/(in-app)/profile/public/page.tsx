"use client"
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ListingCard from "@/components/app/listing-card";
import EmptyPageState from "@/components/app/profile-empty-page-state";
import Image from "next/image";



export default function PublicProfilePage() {
  const [isEmpty, setIsEmpty] = useState(false);

  return (
    <div className="grid grid-cols-1 grid-rows-[auto_3fr] md:grid-cols-[auto_1fr] md:max-h-[calc(100vh-66px)] overflow-hidden">
      <aside className="flex flex-col items-center gap-4 p-4 w-full md:min-w-88 md:min-h-screen relative  border-b  md:border-b-0">
        <Image
          src="/illustrations/illustration-avatar.png"
          alt="User Avatar"
          width={140}
          height={140}
          className="w-35 h-35 rounded-full bg-[#EB963F]"
        />
        <h1 className="text-lg font-semibold leading-4">John Doe</h1>
        <hr className="border-t block w-full h-1" />
        <Button className="w-full">Message</Button>
        <Button variant="outline" className="w-full">Share Profile</Button>
        <hr className="hidden md:block absolute right-0 top-1/2 -translate-y-[55.5%] h-[85%] border-t-0 border-r w-2" />
      </aside>

      <main className="p-4 h-full overflow-y-auto pb-20">
        <header>
          <h2 className="text-lg leading-10 font-semibold sm:text-2xl sm:leading-11">Listings</h2>
        </header>
        {isEmpty ? (
          <EmptyPageState />
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" role="list">
            {Array(6).fill(2).map((_, index) => (
              <ListingCard key={index} title="1 Bedroom Apartment" location="Isolo, Lagos" price="50" />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
