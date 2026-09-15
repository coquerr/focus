import { Info, Smartphone } from "lucide-react";
import { LargeTitle } from "@/components/ui/LargeTitle";
import { SettingsGroup } from "@/components/settings/SettingsGroup";
import { SettingsRow } from "@/components/settings/SettingsRow";
import { DataManagementSection } from "@/components/settings/DataManagementSection";

export default function SettingsPage() {
  return (
    <div>
      <LargeTitle title="Настройки" />
      <div className="space-y-6 px-5">
        <DataManagementSection />

        <SettingsGroup title="О приложении">
          <SettingsRow
            icon={<Info size={15} />}
            iconColor="var(--accent-violet)"
            label="Версия"
            value="1.0.0"
            showChevron={false}
          />
          <SettingsRow
            icon={<Smartphone size={15} />}
            iconColor="var(--accent-amber)"
            label="Хранение данных"
            value="Только на устройстве"
            showChevron={false}
            isLast
          />
        </SettingsGroup>
      </div>
    </div>
  );
}
