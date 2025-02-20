import { Metadata } from 'next'

export const metadata: Metadata = {
  // metadataBase: new URL(defaultUrl),
  title: "Sign In | Campus Connect",
  // description: "Your rental paradise",
};

export default function LoginLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return children
  }