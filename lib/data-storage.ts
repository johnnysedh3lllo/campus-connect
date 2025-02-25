"use strict";

import listingIcon from "@/public/icons/icon-listings.svg";
import inquiriesIcon from "@/public/icons/icon-inquires.svg";
import messagesIcon from "@/public/icons/icon-message.svg";
import profileIcon from "@/public/icons/icon-profile.svg";
import settingsIcon from "@/public/icons/icon-settings.svg";

export interface UserRoles {
  1: string;
  2: string;
  3: string;
}

export const userRoles: UserRoles = {
  1: "admin",
  2: "landlord",
  3: "tenant",
};

export const navLinks = [
  { href: "/listings", text: "Listings" },
  { href: "/inquires", text: "Inquires" },
  { href: "/dashboard/messages", text: "Messages" },
  { href: "/profile", text: "Profile" },
];

export const navLinksMobile = [
  { href: "/listings", text: "Listings", icon: listingIcon },
  { href: "/inquires", text: "Inquires", icon: inquiriesIcon },
  { href: "/dashboard/messages", text: "Messages", icon: messagesIcon },
  { href: "/profile", text: "Profile", icon: profileIcon },
  { href: "/settings", text: "Settings", icon: settingsIcon },
];
