import Navigation from "@/components/ui/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <div>{children}</div>;
    </>
  );
}
