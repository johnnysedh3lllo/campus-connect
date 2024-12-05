import Navigation from "@/components/ui/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <main className="max-w-7xl flex flex-col gap-12 justify-center items-center">
        {children}
      </main>
    </>
  );
}
