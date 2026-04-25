import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@wealthfolio/ui";
import { Badge, Icons, AmountDisplay } from "@wealthfolio/ui";
import type { FeeAnalytics } from "../lib/fee-calculation.service";

// Simple EmptyPlaceholder component since it's not exported from UI package
function EmptyPlaceholder({
  className,
  icon,
  title,
  description,
}: {
  className?: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div
      className={`flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center ${className || ""}`}
    >
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <div className="bg-muted mb-4 flex h-20 w-20 items-center justify-center rounded-full">
          {icon}
        </div>
        <h2 className="mt-2 text-xl font-semibold">{title}</h2>
        <p className="text-muted-foreground mt-2 text-center text-sm font-normal leading-6">
          {description}
        </p>
      </div>
    </div>
  );
}

interface TopFeeSourcesProps {
  feeAnalytics: FeeAnalytics;
  currency: string;
  isBalanceHidden: boolean;
}

export function TopFeeSources({ feeAnalytics, currency, isBalanceHidden }: TopFeeSourcesProps) {
  const { assetFeeAnalysis } = feeAnalytics;

  // Get top 10 fee sources
  const topFeeSources = assetFeeAnalysis.slice(0, 10);

  if (topFeeSources.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">主要费用来源</CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <EmptyPlaceholder
            className="mx-auto flex h-[300px] max-w-[420px] items-center justify-center"
            icon={<Icons.CreditCard className="h-10 w-10" />}
            title="暂无费用数据"
            description="所选时间范围内没有费用记录。请尝试选择其他时间范围或稍后查看。"
          />
        </CardContent>
      </Card>
    );
  }

  // Calculate total fees for percentage calculations
  const totalFees = topFeeSources.reduce((sum: number, source) => sum + source.totalFees, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">主要费用来源</CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <div className="space-y-6">
          {/* Horizontal Bar Chart */}
          <div className="flex w-full space-x-0.5">
            {(() => {
              const top5Sources = topFeeSources.slice(0, 5);
              const otherSources = topFeeSources.slice(5);
              const otherTotal = otherSources.reduce(
                (sum: number, source) => sum + source.totalFees,
                0,
              );

              const chartItems = [
                ...top5Sources.map((source: FeeAnalytics["assetFeeAnalysis"][0]) => ({
                  symbol: source.assetSymbol,
                  name: source.assetName,
                  fees: source.totalFees,
                  isOther: false,
                })),
                ...(otherTotal > 0
                  ? [
                      {
                        symbol: "其他",
                        name: `其他 ${otherSources.length} 个资产`,
                        fees: otherTotal,
                        isOther: true,
                      },
                    ]
                  : []),
              ];

              const colors = [
                "var(--chart-1)",
                "var(--chart-2)",
                "var(--chart-3)",
                "var(--chart-4)",
                "var(--chart-5)",
                "var(--chart-6)",
              ];

              return chartItems.map((item, index) => {
                const percentage = totalFees > 0 ? (item.fees / totalFees) * 100 : 0;

                return (
                  <div
                    key={index}
                    className="group relative h-5 cursor-pointer rounded-lg transition-all duration-300 ease-in-out hover:brightness-110"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: colors[index % colors.length],
                    }}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 transform group-hover:block">
                      <div className="bg-popover text-popover-foreground min-w-[180px] rounded-lg border px-3 py-2 shadow-md">
                        <div className="text-sm font-medium">{item.symbol}</div>
                        <div className="text-muted-foreground text-xs">{item.name}</div>
                        <div className="text-sm font-medium">
                          <AmountDisplay
                            value={item.fees}
                            currency={currency}
                            isHidden={isBalanceHidden}
                          />
                        </div>
                        <div className="text-muted-foreground text-xs">
                          占总费用 {percentage.toFixed(1)}%
                        </div>
                        {/* Tooltip arrow */}
                        <div className="border-t-border absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 transform border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent"></div>
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>

          {/* Detailed List */}
          <div className="space-y-3">
            {topFeeSources.map((source: FeeAnalytics["assetFeeAnalysis"][0], index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge className="bg-primary flex min-w-[60px] items-center justify-center rounded-sm text-xs">
                    {source.assetSymbol}
                  </Badge>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{source.assetName}</span>
                    <div className="text-muted-foreground flex items-center space-x-2 text-xs">
                      <span>{source.transactionCount} 笔交易</span>
                      <span>•</span>
                      <span>
                        均费{" "}
                        <AmountDisplay
                          value={source.averageFeePerTransaction}
                          currency={currency}
                          isHidden={isBalanceHidden}
                        />
                      </span>
                      {source.feeAsPercentageOfVolume > 0 && (
                        <>
                          <span>•</span>
                          <span>占成交额 {source.feeAsPercentageOfVolume.toFixed(2)}%</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-destructive text-sm font-medium">
                    <AmountDisplay
                      value={source.totalFees}
                      currency={currency}
                      isHidden={isBalanceHidden}
                    />
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {totalFees > 0 ? ((source.totalFees / totalFees) * 100).toFixed(1) : 0}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
