import { Button } from "@wealthfolio/ui/components/ui/button";
import { Card, CardContent } from "@wealthfolio/ui/components/ui/card";
import { Icons } from "@wealthfolio/ui/components/ui/icons";
import { Label } from "@wealthfolio/ui/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@wealthfolio/ui/components/ui/radio-group";
import { ExportDataType, ExportedFileFormat } from "@/lib/types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useExportData } from "./use-export-data";

const dataFormatBlueprints = [
  {
    name: "CSV",
    icon: Icons.FileCsv,
    descriptionKey: "exports.formats.csv",
  },
  {
    name: "JSON",
    icon: Icons.FileJson,
    descriptionKey: "exports.formats.json",
  },
  {
    name: "SQLite",
    icon: Icons.Database,
    descriptionKey: "exports.formats.sqlite",
  },
] as const;

const csvJsonItems = [
  {
    key: "accounts",
    nameKey: "exports.dataTypes.accounts",
    icon: Icons.Holdings,
    descriptionKey: "exports.dataTypes.accountsDesc",
  },
  {
    key: "activities",
    nameKey: "exports.dataTypes.activities",
    icon: Icons.Activity,
    descriptionKey: "exports.dataTypes.activitiesDesc",
  },
  {
    key: "goals",
    nameKey: "exports.dataTypes.goals",
    icon: Icons.Goals,
    descriptionKey: "exports.dataTypes.goalsDesc",
  },
  {
    key: "portfolio-history",
    nameKey: "exports.dataTypes.portfolioHistory",
    icon: Icons.Files,
    descriptionKey: "exports.dataTypes.portfolioHistoryDesc",
  },
] as const;

const dataTypeBlueprints = {
  CSV: csvJsonItems,
  JSON: csvJsonItems,
  SQLite: [
    {
      key: "full",
      nameKey: "exports.dataTypes.fullSqlite",
      icon: Icons.Database,
      descriptionKey: "exports.dataTypes.fullSqliteDesc",
    },
  ],
} as const;

export const ExportForm = () => {
  const { t } = useTranslation("settings");
  const [selectedFormat, setSelectedFormat] = useState<string | undefined>();

  const { exportData, isExporting, exportingFormat, exportingData } = useExportData();

  const handleExport = (item: (typeof dataTypeBlueprints)[ExportedFileFormat][number]) => {
    if (!selectedFormat) return;

    exportData({
      data: item.key as ExportDataType,
      format: selectedFormat as ExportedFileFormat,
    });
  };

  return (
    <>
      <div className="mt-8 px-2">
        <h3 className="pb-3 pt-5 font-semibold">{t("exports.exportTab.chooseFormat")}</h3>
        <RadioGroup
          onValueChange={setSelectedFormat}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {dataFormatBlueprints.map((format) => (
            <div key={format.name}>
              <RadioGroupItem value={format.name} id={format.name} className="peer sr-only" />
              <Label
                htmlFor={format.name}
                className="bg-card hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary relative flex cursor-pointer flex-col items-center justify-between rounded-md border p-4 shadow-sm peer-data-[state=checked]:border-2"
              >
                <format.icon className="mb-3 h-6 w-6" />
                <div className="text-center">
                  <h3 className="font-semibold">{format.name}</h3>
                  <p className="text-muted-foreground text-sm font-light">
                    {t(format.descriptionKey)}
                  </p>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {selectedFormat && (
        <div className="px-2 pt-4">
          <h3 className="pb-3 pt-5 font-semibold">{t("exports.exportTab.customize")}</h3>
          {dataTypeBlueprints[selectedFormat as keyof typeof dataTypeBlueprints].map((item) => {
            const itemName = t(item.nameKey);
            return (
              <Card key={item.key} className="mb-4">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <item.icon className="mr-2 h-5 w-5" />
                    <div>
                      <span className="font-medium">{itemName}</span>
                      <p className="text-muted-foreground text-sm">{t(item.descriptionKey)}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleExport(item)}
                    disabled={isExporting}
                  >
                    {isExporting &&
                    exportingFormat === selectedFormat &&
                    exportingData === item.key ? (
                      <>
                        <Icons.Spinner className="h-4 w-4 animate-spin" />
                        <span className="sr-only">
                          {t("exports.exportTab.exporting", { name: itemName })}
                        </span>
                      </>
                    ) : (
                      <>
                        <Icons.Download className="h-4 w-4" />
                        <span className="sr-only">
                          {t("exports.exportTab.exportItem", { name: itemName })}
                        </span>
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
};
