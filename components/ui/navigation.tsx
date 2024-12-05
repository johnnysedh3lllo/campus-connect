import Link from "next/link";
// import { EnvVarWarning } from "@/components/env-var-warning";
// import HeaderAuth from "@/components/header-auth";
// import { hasEnvVars } from "@/utils/supabase/check-env-vars";

export default async function Navigation() {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href={"/"}>Campus Connect Home</Link>
        </div>
        {/* {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />} */}
      </div>
    </nav>
  );
}
