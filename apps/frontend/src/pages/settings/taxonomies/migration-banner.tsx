import { Alert, AlertDescription, AlertTitle, Button, Icons } from "@wealthfolio/ui";
import { useTranslation } from "react-i18next";
import { useMigrationStatus, useMigrateLegacyClassifications } from "@/hooks/use-taxonomies";
import { toast } from "sonner";

export function MigrationBanner() {
  const { t } = useTranslation("settings");
  const { data: status, isLoading } = useMigrationStatus();
  const migrateMutation = useMigrateLegacyClassifications();

  // Don't show if loading, not needed, or no legacy data
  if (isLoading || !status?.needed || status.assetsWithLegacyData === 0) {
    return null;
  }

  const handleMigrate = async () => {
    try {
      const result = await migrateMutation.mutateAsync();
      toast.success(
        t("taxonomies.migration.complete", {
          sectors: result.sectorsMigrated,
          countries: result.countriesMigrated,
        }),
      );
      if (result.errors.length > 0) {
        toast.warning(t("taxonomies.migration.skipped", { count: result.errors.length }));
      }
    } catch (_error) {
      toast.error(t("taxonomies.migration.failed"));
    }
  };

  return (
    <Alert className="mb-6">
      <Icons.Info className="h-4 w-4" />
      <AlertTitle>{t("taxonomies.migration.title")}</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-3">
          {t("taxonomies.migration.description", { count: status.assetsWithLegacyData })}
        </p>
        <Button onClick={handleMigrate} disabled={migrateMutation.isPending} size="sm">
          {migrateMutation.isPending ? (
            <>
              <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
              {t("taxonomies.migration.migrating")}
            </>
          ) : (
            t("taxonomies.migration.start")
          )}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
