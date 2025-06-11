"use client";
import { useGetUser } from "@/lib/hooks/tanstack/queries/use-get-user";
import { useUserStore } from "../store/user/user-store";
import { useEffect } from "react";

export default function UserIdentityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useUserStore((s) => s.setUser);
  const { data: userData, isSuccess } = useGetUser();
  const userId = userData?.id;
  const userRoleId = +userData?.user_metadata.role_id;

  useEffect(() => {
    if (isSuccess && userId && userRoleId) {
      setUser(userId, userRoleId);
    }
  }, [isSuccess, userData, setUser]);

  return <>{children}</>;
}
