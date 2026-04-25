import { AnimatedToggleGroup } from "@wealthfolio/ui";

const periods = [
  { value: "YTD" as const, label: "今年至今" },
  { value: "LAST_YEAR" as const, label: "去年" },
  { value: "TOTAL" as const, label: "全部" },
];

const mobilePeriods = [
  { value: "YTD" as const, label: "今年" },
  { value: "LAST_YEAR" as const, label: "去年" },
  { value: "TOTAL" as const, label: "全部" },
];

interface FeePeriodSelectorProps {
  selectedPeriod: "TOTAL" | "YTD" | "LAST_YEAR";
  onPeriodSelect: (period: "TOTAL" | "YTD" | "LAST_YEAR") => void;
}

export function FeePeriodSelector({ selectedPeriod, onPeriodSelect }: FeePeriodSelectorProps) {
  return (
    <>
      <div className="hidden sm:block">
        <AnimatedToggleGroup
          items={periods}
          value={selectedPeriod}
          onValueChange={onPeriodSelect}
          variant="secondary"
          size="sm"
          rounded="full"
        />
      </div>
      <div className="block sm:hidden">
        <AnimatedToggleGroup
          items={mobilePeriods}
          value={selectedPeriod}
          onValueChange={onPeriodSelect}
          variant="secondary"
          size="xs"
          rounded="full"
        />
      </div>
    </>
  );
}
