import { SettingsPageBody } from "@/components/app/settings-page-body";
import { getUserSettings } from "@/app/actions/supabase/settings";

export default async function SettingsPage() {
  const { data: initialSettings } = await getUserSettings();
  return <SettingsPageBody initialSettings={initialSettings} />;
}