import { Suspense } from "react";
import { SettingsContent } from "@/components/preferences";
import { SettingsLoading } from "@/components/preferences/settings-loading";

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsLoading />}>
      <SettingsContent />
    </Suspense>
  );
}
