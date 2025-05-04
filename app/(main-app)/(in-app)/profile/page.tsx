// UTILITIES
import { ProfilePageBody } from "@/components/app/profile-page-body";
import { Toaster } from "@/components/ui/toaster";

export default async function ProfilePage() {
  return (
    <>
      <ProfilePageBody />
      <Toaster />
    </>
  );
}
