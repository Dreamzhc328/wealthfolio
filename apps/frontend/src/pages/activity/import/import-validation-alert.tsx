import React from "react";
import { useTranslation } from "react-i18next";

import { Alert, AlertDescription, AlertTitle } from "@wealthfolio/ui/components/ui/alert";
import { Button } from "@wealthfolio/ui/components/ui/button";
import { Icons } from "@wealthfolio/ui/components/ui/icons";

interface ValidationAlertProps {
  success: boolean;
  warnings: number;
  error: string | null;
  isConfirming: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ValidationAlert: React.FC<ValidationAlertProps> = ({
  success,
  warnings,
  error,
  isConfirming,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation("assets");
  if (warnings > 0) {
    return (
      <Alert className="mb-4 flex flex-col" variant="warning">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <Icons.AlertCircle className="mr-2 h-4 w-4" />
            <AlertTitle>
              {t("import.legacy.issuesTitle", { n: warnings })}
              <p className="pt-1 text-sm font-normal">{t("import.legacy.issuesIntro")}</p>
              <p className="pt-1 text-sm font-normal">{t("import.legacy.issuesHint")}</p>
            </AlertTitle>
          </div>
        </div>
        <div className="mt-2 flex justify-start">
          <Button className="mr-2" onClick={onCancel}>
            {t("import.legacy.retry")}
          </Button>
        </div>
      </Alert>
    );
  }
  if (success) {
    return (
      <Alert className="mb-4 flex flex-col" variant="success">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <Icons.CheckCircle className="mr-2 h-4 w-4" />
            <div>
              <AlertTitle>{t("import.legacy.allValidTitle")}</AlertTitle>
              <AlertDescription>
                {t("import.legacy.allValidDescription").split("<0>")[0]}
                <b>{t("import.legacy.confirmImport")}</b>
                {t("import.legacy.allValidDescription").split("</0>")[1]}
              </AlertDescription>
            </div>
          </div>
        </div>
        <div className="mt-2 flex justify-start">
          <Button variant="secondary" className="mr-2" disabled={isConfirming} onClick={onCancel}>
            {t("import.legacy.cancel")}
          </Button>
          <Button onClick={onConfirm} disabled={isConfirming}>
            {isConfirming ? (
              <>
                <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
                <span className="hidden sm:ml-2 sm:inline">{t("import.legacy.importing")}</span>
              </>
            ) : (
              <>
                <Icons.Import className="mr-2 h-4 w-4" />
                <span className="hidden sm:ml-2 sm:inline">
                  {t("import.legacy.confirmImport")}
                </span>
              </>
            )}
          </Button>
        </div>
      </Alert>
    );
  }
  if (error) {
    return (
      <Alert className="mb-4 flex flex-col" variant="destructive">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <Icons.AlertCircle className="mr-2 h-4 w-4" />
            <AlertTitle>{error}</AlertTitle>
          </div>
        </div>
        <div className="mt-2 flex justify-start">
          <Button className="mr-2" onClick={onCancel}>
            {t("import.legacy.retry")}
          </Button>
        </div>
      </Alert>
    );
  }
  return null;
};

export default ValidationAlert;
