import Navigation from "@/components/ui/navigation";

export const metadata = {
  title: "Campus Connect | Rental Paradise",
  description: "A rental platform for students.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="border border-black border-solid">
        <Navigation />
      </div>
      <main>{children}</main>
    </>
  );
}
