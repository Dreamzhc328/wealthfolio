import { useTranslation } from "react-i18next";
import { ConnectedView, LoginForm, useWealthfolioConnect } from "@/features/wealthfolio-connect";
import { Card, CardDescription, CardHeader, CardTitle } from "@wealthfolio/ui";
import { Icons } from "@wealthfolio/ui/components/ui/icons";
import { Separator } from "@wealthfolio/ui/components/ui/separator";
import { SettingsHeader } from "../settings-header";

export default function ConnectSettingsPage() {
  const { t } = useTranslation("settings");
  const { isEnabled, isConnected, isInitializing } = useWealthfolioConnect();

  // Show "not configured" state when Connect feature is disabled
  if (!isEnabled) {
    return (
      <div className="space-y-6">
        <SettingsHeader heading={t("connect.heading")} text={t("connect.description")} />
        <Separator />
        <Card>
          <CardHeader className="items-center text-center">
            <div className="bg-muted mb-2 flex h-12 w-12 items-center justify-center rounded-full">
              <Icons.CloudOff className="text-muted-foreground h-6 w-6" />
            </div>
            <CardTitle>{t("connect.notConfigured")}</CardTitle>
            <CardDescription>{t("connect.notConfiguredDesc")}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isInitializing) {
    return (
      <div className="space-y-6">
        <SettingsHeader heading={t("connect.heading")} text={t("connect.description")} />
        <Separator />
        <div className="flex items-center justify-center py-12">
          <Icons.Spinner className="text-muted-foreground h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SettingsHeader heading={t("connect.heading")} text={t("connect.descriptionLong")} />
      <Separator />
      {isConnected ? <ConnectedView /> : <LoginForm />}
    </div>
  );
}
