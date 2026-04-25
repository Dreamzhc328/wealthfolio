import {
  GainAmount,
  GainPercent,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Icons,
  EmptyPlaceholder,
  Separator,
} from "@wealthfolio/ui";
import { TickerAvatar } from "./ticker-avatar";
import { parseOccSymbol, formatOptionDescription, cn } from "../lib/utils";
import type { OpenPosition } from "../types";

interface OpenTradesTableProps {
  positions: OpenPosition[];
  onAssetClick?: (assetId: string) => void;
}

function PositionInfo({ position }: { position: OpenPosition }) {
  const parsed = parseOccSymbol(position.symbol);
  const displaySymbol = parsed ? parsed.underlying : position.symbol;
  const optionDescription = formatOptionDescription(position.symbol);

  return (
    <div className="flex items-center gap-2">
      <TickerAvatar symbol={position.symbol} className="h-8 w-8" />
      <div className="min-w-0">
        <div className="font-medium">{displaySymbol}</div>
        {optionDescription ? (
          <div className="text-muted-foreground text-xs">{optionDescription}</div>
        ) : position.assetName ? (
          <div
            className="text-muted-foreground max-w-[120px] truncate text-xs"
            title={position.assetName}
          >
            {position.assetName}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function OpenTradesTable({ positions, onAssetClick }: OpenTradesTableProps) {
  if (positions.length === 0) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center sm:h-[300px]">
        <EmptyPlaceholder
          className="mx-auto flex max-w-[400px] items-center justify-center"
          icon={<Icons.TrendingUp className="h-10 w-10" />}
          title="暂无未平仓位"
          description="你目前没有任何持仓中的短线交易。平仓后的交易会出现在表现统计中。"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile card layout */}
      <div className="space-y-2 md:hidden">
        {positions.map((position, index) => (
          <div key={position.id}>
            <div
              className={cn(
                "flex items-center justify-between p-3",
                onAssetClick && "cursor-pointer",
              )}
              onClick={() => onAssetClick?.(position.assetId)}
            >
              <PositionInfo position={position} />
              <div className="flex items-center gap-2 text-right">
                <div>
                  <GainAmount
                    value={position.unrealizedPL}
                    currency={position.currency}
                    className="text-sm font-medium"
                  />
                  <GainPercent value={position.unrealizedReturnPercent} className="text-xs" />
                </div>
                <Badge variant="outline" className="text-xs">
                  {position.daysOpen}d
                </Badge>
              </div>
            </div>
            {index < positions.length - 1 && <Separator />}
          </div>
        ))}
      </div>

      {/* Desktop table layout */}
      <div className="hidden rounded-md border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]"></TableHead>
              <TableHead>代码</TableHead>
              <TableHead className="text-right">数量</TableHead>
              <TableHead className="text-right">均价</TableHead>
              <TableHead className="text-right">现价</TableHead>
              <TableHead className="text-right">盈亏</TableHead>
              <TableHead className="text-right">收益率</TableHead>
              <TableHead className="text-center">持仓天数</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions.map((position) => {
              const parsed = parseOccSymbol(position.symbol);
              const displaySymbol = parsed ? parsed.underlying : position.symbol;
              const optionDescription = formatOptionDescription(position.symbol);

              return (
                <TableRow
                  key={position.id}
                  className={onAssetClick ? "cursor-pointer" : undefined}
                  onClick={() => onAssetClick?.(position.assetId)}
                >
                  <TableCell>
                    <TickerAvatar symbol={position.symbol} className="h-8 w-8" />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{displaySymbol}</div>
                      {optionDescription ? (
                        <div className="text-muted-foreground text-xs">{optionDescription}</div>
                      ) : position.assetName ? (
                        <div
                          className="text-muted-foreground max-w-[120px] truncate text-xs"
                          title={position.assetName}
                        >
                          {position.assetName}
                        </div>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{position.quantity.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    {position.averageCost.toLocaleString("en-US", {
                      style: "currency",
                      currency: position.currency,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    {position.currentPrice.toLocaleString("en-US", {
                      style: "currency",
                      currency: position.currency,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <GainAmount value={position.unrealizedPL} currency={position.currency} />
                  </TableCell>
                  <TableCell className="text-right">
                    <GainPercent value={position.unrealizedReturnPercent} />
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="text-xs">
                      {position.daysOpen}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
