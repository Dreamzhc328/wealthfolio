import { Separator } from "@wealthfolio/ui/components/ui/separator";
import { useTranslation } from "react-i18next";
import { SettingsHeader } from "../settings-header";
import { AppearanceForm } from "./appearance-form";

export default function SettingsAppearancePage() {
  const { t } = useTranslation("settings");

  return (
    <div className="space-y-6">
      <SettingsHeader heading={t("appearance.heading")} text={t("appearance.description")} />
      <Separator />
      <AppearanceForm />
    </div>
  );
}
