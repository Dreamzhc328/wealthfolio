import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Icons,
} from "@wealthfolio/ui";
import type { Table } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import type { ChangesSummary, LocalTransaction } from "./types";

// Column ID -> i18n key
const COLUMN_LABEL_KEYS: Record<string, string> = {
  activityType: "dataGrid.columns.type",
  subtype: "dataGrid.columns.subtype",
  activityStatus: "dataGrid.columns.status",
  date: "dataGrid.columns.dateTime",
  assetSymbol: "dataGrid.columns.symbol",
  quantity: "dataGrid.columns.quantity",
  unitPrice: "dataGrid.columns.price",
  amount: "dataGrid.columns.amount",
  fee: "dataGrid.columns.fee",
  fxRate: "dataGrid.columns.fxRate",
  accountName: "dataGrid.columns.account",
  currency: "dataGrid.columns.currency",
  instrumentType: "dataGrid.columns.instrument",
  comment: "dataGrid.columns.comment",
};

// Columns that can be toggled (exclude select, status indicator, actions)
const TOGGLEABLE_COLUMNS = [
  "activityType",
  "subtype",
  "instrumentType",
  "activityStatus",
  "date",
  "assetSymbol",
  "quantity",
  "unitPrice",
  "amount",
  "fee",
  "fxRate",
  "accountName",
  "currency",
  "comment",
];

interface ActivityDataGridToolbarProps {
  /** Number of rows currently selected */
  selectedRowCount: number;
  /** Number of selected rows that are pending review (synced/draft) */
  selectedPendingCount: number;
  /** Whether there are unsaved changes */
  hasUnsavedChanges: boolean;
  /** Summary of pending changes */
  changesSummary: ChangesSummary;
  /** Whether a save operation is in progress */
  isSaving: boolean;
  /** Table instance for column visibility */
  table: Table<LocalTransaction>;
  /** Handler for adding a new row */
  onAddRow: () => void;
  /** Handler for deleting selected rows */
  onDeleteSelected: () => void;
  /** Handler for approving selected synced activities */
  onApproveSelected: () => void;
  /** Handler for saving changes */
  onSave: () => void;
  /** Handler for canceling/discarding changes */
  onCancel: () => void;
}

/**
 * Toolbar component for the activity data grid
 * Displays status, selection info, and action buttons
 */
export function ActivityDataGridToolbar({
  selectedRowCount,
  selectedPendingCount,
  hasUnsavedChanges,
  changesSummary,
  isSaving,
  table,
  onAddRow,
  onDeleteSelected,
  onApproveSelected,
  onSave,
  onCancel,
}: ActivityDataGridToolbarProps) {
  const { t } = useTranslation("assets");
  // Prevent mousedown from bubbling to document, which would clear DataGrid selection
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="bg-muted/20 flex flex-wrap items-center justify-between gap-2 rounded-md border px-2.5 py-1.5"
      onMouseDown={handleMouseDown}
    >
      <div className="text-muted-foreground flex items-center gap-2.5 text-xs">
        {/* Selection info */}
        {selectedRowCount > 0 && (
          <span className="font-medium">
            {selectedRowCount === 1
              ? t("dataGrid.rowSelected", { count: selectedRowCount })
              : t("dataGrid.rowsSelected", { count: selectedRowCount })}
          </span>
        )}

        {/* Pending changes info */}
        {hasUnsavedChanges && (
          <div className="flex items-center gap-2">
            <span className="text-primary font-medium">
              {changesSummary.totalPendingChanges === 1
                ? t("dataGrid.pendingChange", { count: changesSummary.totalPendingChanges })
                : t("dataGrid.pendingChanges", { count: changesSummary.totalPendingChanges })}
            </span>
            <div className="bg-border h-3.5 w-px" />
            <div className="flex items-center gap-4">
              {changesSummary.newCount > 0 && (
                <span className="text-success flex items-center gap-1">
                  <Icons.PlusCircle className="h-3 w-3" />
                  <span className="font-medium">{changesSummary.newCount}</span>
                </span>
              )}
              {changesSummary.updatedCount > 0 && (
                <span className="flex items-center gap-1 text-blue-500 dark:text-blue-400">
                  <Icons.Pencil className="h-3 w-3" />
                  <span className="font-medium">{changesSummary.updatedCount}</span>
                </span>
              )}
              {changesSummary.deletedCount > 0 && (
                <span className="text-destructive flex items-center gap-1">
                  <Icons.Trash className="h-3 w-3" />
                  <span className="font-medium">{changesSummary.deletedCount}</span>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1">
        <Button
          onClick={onAddRow}
          variant="outline"
          size="xs"
          className="shrink-0 rounded-md"
          title={t("dataGrid.addTransaction")}
          aria-label={t("dataGrid.addTransaction")}
        >
          <Icons.Plus className="h-3.5 w-3.5" />
          <span>{t("dataGrid.add")}</span>
        </Button>

        {/* Column visibility dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="xs"
              className="shrink-0 rounded-md px-2"
              title={t("dataGrid.toggleColumns")}
              aria-label={t("dataGrid.toggleColumns")}
            >
              <Icons.Settings2 className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel className="text-xs">{t("dataGrid.toggleColumns")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => TOGGLEABLE_COLUMNS.includes(column.id))
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="text-xs"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {COLUMN_LABEL_KEYS[column.id] ? t(COLUMN_LABEL_KEYS[column.id]) : column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {selectedRowCount > 0 && (
          <>
            <div className="bg-border mx-1 h-4 w-px" />
            {selectedPendingCount > 0 && (
              <Button
                onClick={onApproveSelected}
                size="xs"
                variant="outline"
                className="shrink-0 rounded-md border-green-200 bg-green-50 text-xs text-green-700 hover:bg-green-100 hover:text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40"
                title={t("dataGrid.approveTitle")}
                aria-label={t("dataGrid.approveTitle")}
                disabled={isSaving}
              >
                <Icons.CheckCircle className="h-3.5 w-3.5" />
                <span>{t("dataGrid.approveSelected", { count: selectedPendingCount })}</span>
              </Button>
            )}
            <Button
              onClick={onDeleteSelected}
              size="xs"
              variant="destructive"
              className="shrink-0 rounded-md text-xs"
              title={t("dataGrid.deleteSelected")}
              aria-label={t("dataGrid.deleteSelected")}
              disabled={isSaving}
            >
              <Icons.Trash className="h-3.5 w-3.5" />
              <span>{t("dataGrid.delete")}</span>
            </Button>
          </>
        )}

        {hasUnsavedChanges && (
          <>
            <div className="bg-border mx-1 h-4 w-px" />
            <Button
              onClick={onSave}
              size="xs"
              className="shrink-0 rounded-md text-xs"
              title={t("dataGrid.saveTitle")}
              aria-label={t("dataGrid.saveTitle")}
              disabled={isSaving}
            >
              {isSaving ? (
                <Icons.Spinner className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Icons.Save className="h-3.5 w-3.5" />
              )}
              <span>{t("dataGrid.save")}</span>
            </Button>

            <Button
              onClick={onCancel}
              size="xs"
              variant="outline"
              className="shrink-0 rounded-md text-xs"
              title={t("dataGrid.discardTitle")}
              aria-label={t("dataGrid.discardTitle")}
              disabled={isSaving}
            >
              <Icons.Undo className="h-3.5 w-3.5" />
              <span>{t("dataGrid.cancel")}</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
