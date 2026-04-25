import { Button } from "@wealthfolio/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@wealthfolio/ui/components/ui/card";
import { Icons } from "@wealthfolio/ui/components/ui/icons";
import { useTranslation } from "react-i18next";
import { useBackupRestore } from "./use-backup-restore";

const desktopNoteKeys = [
  "exports.backup.notes.desktop1",
  "exports.backup.notes.desktop2",
  "exports.backup.notes.desktop3",
  "exports.backup.notes.desktop4",
] as const;

const webNoteKeys = [
  "exports.backup.notes.web1",
  "exports.backup.notes.web2",
  "exports.backup.notes.web3",
  "exports.backup.notes.web4",
] as const;

const mobileNoteKeys = [
  "exports.backup.notes.mobile1",
  "exports.backup.notes.mobile2",
  "exports.backup.notes.mobile3",
  "exports.backup.notes.mobile4",
] as const;

export const BackupRestoreForm = () => {
  const { performBackup, performRestore, isBackingUp, isRestoring, canRestore, platformMode } =
    useBackupRestore();

  return platformMode === "desktop" ? (
    <DesktopBackupPanel
      performBackup={performBackup}
      performRestore={performRestore}
      isBackingUp={isBackingUp}
      isRestoring={isRestoring}
    />
  ) : platformMode === "mobile" ? (
    <MobileBackupPanel
      performBackup={performBackup}
      performRestore={performRestore}
      isBackingUp={isBackingUp}
      isRestoring={isRestoring}
      canRestore={canRestore}
    />
  ) : (
    <WebBackupPanel performBackup={performBackup} isBackingUp={isBackingUp} />
  );
};

interface DesktopPanelProps {
  performBackup: () => Promise<void>;
  performRestore: () => Promise<void>;
  isBackingUp: boolean;
  isRestoring: boolean;
}

const DesktopBackupPanel = ({
  performBackup,
  performRestore,
  isBackingUp,
  isRestoring,
}: DesktopPanelProps) => {
  const { t } = useTranslation("settings");
  return (
    <div className="space-y-6">
      <PanelIntro />

      <div className="grid gap-4 md:grid-cols-2">
        <BackupCard
          title={t("exports.backup.createTitle")}
          description={t("exports.backup.createDescDesktop")}
          isLoading={isBackingUp}
          disabled={isBackingUp || isRestoring}
          actionLabel={t("exports.backup.actionLabel")}
          onAction={performBackup}
        />

        <Card className="flex h-full flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Icons.DatabaseBackup className="h-5 w-5" />
              {t("exports.backup.restoreTitle")}
            </CardTitle>
            <CardDescription>{t("exports.backup.restoreDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Button
              onClick={performRestore}
              disabled={isRestoring || isBackingUp}
              variant="outline"
              className="w-full"
            >
              {isRestoring ? (
                <>
                  <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
                  {t("exports.backup.restoring")}
                </>
              ) : (
                <>
                  <Icons.Import className="mr-2 h-4 w-4" />
                  {t("exports.backup.restoreAction")}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <ImportantNotes noteKeys={desktopNoteKeys} />
    </div>
  );
};

interface WebPanelProps {
  performBackup: () => Promise<void>;
  isBackingUp: boolean;
}

const WebBackupPanel = ({ performBackup, isBackingUp }: WebPanelProps) => {
  const { t } = useTranslation("settings");
  return (
    <div className="space-y-6">
      <PanelIntro />

      <BackupCard
        title={t("exports.backup.createTitle")}
        description={t("exports.backup.createDescWeb")}
        isLoading={isBackingUp}
        disabled={isBackingUp}
        actionLabel={t("exports.backup.actionLabel")}
        onAction={performBackup}
      />

      <ImportantNotes noteKeys={webNoteKeys} />
    </div>
  );
};

interface MobilePanelProps extends WebPanelProps {
  performRestore: () => Promise<void>;
  isRestoring: boolean;
  canRestore: boolean;
}

const MobileBackupPanel = ({
  performBackup,
  performRestore,
  isBackingUp,
  isRestoring,
  canRestore,
}: MobilePanelProps) => {
  const { t } = useTranslation("settings");
  return (
    <div className="space-y-6">
      <PanelIntro />

      <div className="grid gap-4 md:grid-cols-2">
        <BackupCard
          title={t("exports.backup.createTitle")}
          description={t("exports.backup.createDescMobile")}
          isLoading={isBackingUp}
          disabled={isBackingUp}
          actionLabel={t("exports.backup.actionLabel")}
          onAction={performBackup}
        />

        <Card className="flex h-full flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Icons.DatabaseBackup className="h-5 w-5" />
              {t("exports.backup.restoreTitle")}
            </CardTitle>
            <CardDescription>
              {canRestore
                ? t("exports.backup.restoreDescMobile")
                : t("exports.backup.restoreUnavailable")}
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Button
              onClick={performRestore}
              disabled={!canRestore || isRestoring || isBackingUp}
              variant="outline"
              className="w-full"
            >
              {isRestoring ? (
                <>
                  <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
                  {t("exports.backup.restoring")}
                </>
              ) : (
                <>
                  <Icons.Import className="mr-2 h-4 w-4" />
                  {t("exports.backup.restoreAction")}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <ImportantNotes noteKeys={mobileNoteKeys} />
    </div>
  );
};

const PanelIntro = () => {
  const { t } = useTranslation("settings");
  return (
    <div>
      <h3 className="text-lg font-semibold">{t("exports.backup.panelHeading")}</h3>
      <p className="text-muted-foreground text-sm">{t("exports.backup.panelDescription")}</p>
    </div>
  );
};

interface BackupCardProps {
  title: string;
  description: string;
  onAction: () => Promise<void>;
  isLoading: boolean;
  actionLabel: string;
  disabled?: boolean;
}

const BackupCard = ({
  title,
  description,
  onAction,
  isLoading,
  actionLabel,
  disabled,
}: BackupCardProps) => {
  const { t } = useTranslation("settings");
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icons.DatabaseZap className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <Button onClick={onAction} disabled={disabled ?? isLoading} className="w-full">
          {isLoading ? (
            <>
              <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
              {t("exports.backup.creating")}
            </>
          ) : (
            <>
              <Icons.Download className="mr-2 h-4 w-4" />
              {actionLabel}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

const ImportantNotes = ({ noteKeys }: { noteKeys: readonly string[] }) => {
  const { t } = useTranslation("settings");
  return (
    <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <Icons.AlertTriangle className="mt-0.5 h-5 w-5 text-orange-600" />
          <div className="text-sm">
            <p className="font-medium text-orange-800 dark:text-orange-200">
              {t("exports.backup.importantNotes")}
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-orange-700 dark:text-orange-300">
              {noteKeys.map((noteKey) => (
                <li key={noteKey}>{t(noteKey)}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
