import Link from "next/link";
import HeaderAuth from "@/components/app/header-auth";

export default function Navigation({ route }: { route: string }) {
  return (
    <nav className="bg-background border-b-foreground/10 sticky top-0 flex h-16 w-full justify-center border-b">
      <div className="flex w-full max-w-5xl items-center justify-between p-3 px-5 text-sm">
        <div className="flex items-center gap-5 font-semibold">
          <Link href={route}>Campus Connect Home</Link>
        </div>
        <HeaderAuth />
      </div>
    </nav>
  );
}
