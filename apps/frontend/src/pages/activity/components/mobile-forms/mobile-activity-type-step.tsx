import { FormControl, FormField, FormItem } from "@wealthfolio/ui/components/ui/form";
import { Icons } from "@wealthfolio/ui/components/ui/icons";
import { RadioGroup, RadioGroupItem } from "@wealthfolio/ui/components/ui/radio-group";
import { ScrollArea } from "@wealthfolio/ui/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

const activityTypeGroups = [
  {
    categoryKey: "activityTypes.categoryTrade",
    types: [
      { value: "BUY", labelKey: "activityTypes.buy", icon: "ArrowDown" as const, descriptionKey: "activityTypes.buyDescription" },
      { value: "SELL", labelKey: "activityTypes.sell", icon: "ArrowUp" as const, descriptionKey: "activityTypes.sellDescription" },
    ],
  },
  {
    categoryKey: "activityTypes.categoryCash",
    types: [
      { value: "DEPOSIT", labelKey: "activityTypes.deposit", icon: "ArrowDown" as const, descriptionKey: "activityTypes.depositDescription" },
      { value: "WITHDRAWAL", labelKey: "activityTypes.withdrawal", icon: "ArrowUp" as const, descriptionKey: "activityTypes.withdrawalDescription" },
      { value: "TRANSFER_OUT", labelKey: "activityTypes.transfer", icon: "ArrowLeftRight" as const, descriptionKey: "activityTypes.transferDescription" },
    ],
  },
  {
    categoryKey: "activityTypes.categoryIncome",
    types: [
      { value: "DIVIDEND", labelKey: "activityTypes.dividend", icon: "Income" as const, descriptionKey: "activityTypes.dividendDescription" },
      { value: "INTEREST", labelKey: "activityTypes.interest", icon: "Percent" as const, descriptionKey: "activityTypes.interestDescription" },
    ],
  },
  {
    categoryKey: "activityTypes.categoryOther",
    types: [
      { value: "FEE", labelKey: "activityTypes.fee", icon: "DollarSign" as const, descriptionKey: "activityTypes.feeDescription" },
      { value: "TAX", labelKey: "activityTypes.tax", icon: "Receipt" as const, descriptionKey: "activityTypes.taxDescription" },
      { value: "SPLIT", labelKey: "activityTypes.stockSplit", icon: "Split" as const, descriptionKey: "activityTypes.splitDescription" },
      { value: "ADJUSTMENT", labelKey: "activityTypes.adjustment", icon: "RefreshCw" as const, descriptionKey: "activityTypes.adjustmentDescription" },
    ],
  },
];

export function MobileActivityTypeStep() {
  const { t } = useTranslation("assets");
  const { control } = useFormContext();

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{t("form.fields.selectTransactionType")}</h3>
      </div>

      <ScrollArea>
        <FormField
          control={control}
          name="activityType"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} value={field.value as string}>
                  <div className="space-y-6 pb-4">
                    {activityTypeGroups.map((category) => (
                      <div key={category.categoryKey}>
                        <h4 className="text-muted-foreground mb-3 text-sm font-medium">
                          {t(category.categoryKey)}
                        </h4>
                        <div className="space-y-2">
                          {category.types.map((type) => {
                            const Icon = Icons[type.icon];
                            return (
                              <div key={type.value}>
                                <RadioGroupItem
                                  value={type.value}
                                  id={type.value}
                                  className="peer sr-only"
                                />
                                <label
                                  htmlFor={type.value}
                                  className={cn(
                                    "flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-all",
                                    "hover:bg-muted/50",
                                    "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5",
                                    "active:scale-[0.98]",
                                  )}
                                >
                                  <div className="mt-0.5 flex-shrink-0">
                                    <div
                                      className={cn(
                                        "flex h-10 w-10 items-center justify-center rounded-full",
                                        "bg-muted transition-colors",
                                        "peer-data-[state=checked]:bg-primary/10",
                                      )}
                                    >
                                      <Icon className="h-5 w-5" />
                                    </div>
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="font-medium">{t(type.labelKey)}</div>
                                    <div className="text-muted-foreground mt-0.5 text-sm">
                                      {t(type.descriptionKey)}
                                    </div>
                                  </div>
                                  {field.value === type.value && (
                                    <Icons.Check className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                                  )}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
      </ScrollArea>
    </div>
  );
}
