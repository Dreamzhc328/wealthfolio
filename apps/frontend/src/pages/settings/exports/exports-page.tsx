import { Separator } from "@wealthfolio/ui/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@wealthfolio/ui/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { SettingsHeader } from "../settings-header";
import { BackupRestoreForm } from "./backup-restore-form";
import { ExportForm } from "./exports-form";

const ExportSettingsPage = () => {
  const { t } = useTranslation("settings");
  return (
    <div className="space-y-6">
      <SettingsHeader heading={t("exports.heading")} text={t("exports.description")} />
      <Separator />

      <Tabs defaultValue="backup" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="backup">{t("exports.tabs.backup")}</TabsTrigger>
          <TabsTrigger value="export">{t("exports.tabs.export")}</TabsTrigger>
        </TabsList>

        <TabsContent value="backup" className="mt-6">
          <BackupRestoreForm />
        </TabsContent>

        <TabsContent value="export" className="mt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{t("exports.exportTab.heading")}</h3>
              <p className="text-muted-foreground text-sm">
                {t("exports.exportTab.description")}
              </p>
            </div>
            <ExportForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExportSettingsPage;
