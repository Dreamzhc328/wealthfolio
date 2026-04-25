import { searchTicker } from "@/adapters";
import { Button } from "@wealthfolio/ui/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@wealthfolio/ui/components/ui/command";
import { Icons } from "@wealthfolio/ui/components/ui/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@wealthfolio/ui/components/ui/popover";
import { Skeleton } from "@wealthfolio/ui/components/ui/skeleton";
import { SymbolSearchResult } from "@/lib/types";
import { getExchangeDisplayName } from "@/lib/constants";

import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

// Predefined benchmarks with canonical asset IDs
// exchangeMic is undefined for indices (will use "INDEX" as pseudo-MIC)
// exchangeMic is set for ETFs that trade on real exchanges
const BENCHMARKS = [
  {
    group: "美股指数",
    items: [
      { symbol: "^GSPC", name: "S&P 500", description: "美国大盘股" },
      { symbol: "^NDX", name: "Nasdaq 100", description: "美国科技大盘股" },
      { symbol: "^RUT", name: "Russell 2000", description: "美国小盘股" },
      { symbol: "^DJI", name: "Dow Jones", description: "美国蓝筹股" },
    ],
  },
  {
    group: "欧洲指数",
    items: [
      { symbol: "^FTSE", name: "FTSE 100", description: "英国大盘股" },
      { symbol: "^STOXX50E", name: "EURO STOXX 50", description: "欧洲蓝筹股" },
      { symbol: "^GDAXI", name: "DAX", description: "德国蓝筹股" },
      { symbol: "^FCHI", name: "CAC 40", description: "法国大盘股" },
      { symbol: "^IBEX", name: "IBEX 35", description: "西班牙大盘股" },
      { symbol: "^AEX", name: "AEX", description: "荷兰蓝筹股" },
      { symbol: "^OMX", name: "OMX Stockholm 30", description: "瑞典大盘股" },
    ],
  },
  {
    group: "亚太指数",
    items: [
      { symbol: "^N225", name: "Nikkei 225", description: "日经 225" },
      { symbol: "^HSI", name: "Hang Seng", description: "香港大盘股" },
      { symbol: "000001.SS", name: "Shanghai Composite", description: "上证综指" },
      { symbol: "^KS11", name: "KOSPI", description: "韩国综合指数" },
      { symbol: "^TWII", name: "Taiwan Weighted", description: "台湾加权指数" },
      { symbol: "^AXJO", name: "ASX 200", description: "澳大利亚大盘股" },
      { symbol: "^BSESN", name: "BSE Sensex", description: "印度孟买敏感指数" },
      { symbol: "^NSEI", name: "NIFTY 50", description: "印度国家证交所指数" },
    ],
  },
  {
    group: "全球与新兴市场",
    items: [
      {
        symbol: "EEM",
        name: "MSCI Emerging Markets",
        description: "新兴市场股票",
        exchangeMic: "ARCX",
      },
      {
        symbol: "ACWI",
        name: "MSCI All Country World",
        description: "全球股市",
        exchangeMic: "XNAS",
      },
      {
        symbol: "IEFA",
        name: "Core MSCI EAFE",
        description: "欧洲、澳洲、远东",
        exchangeMic: "ARCX",
      },
    ],
  },
  {
    group: "ETF",
    items: [
      {
        symbol: "VOO",
        name: "Vanguard S&P 500",
        description: "S&P 500 指数基金",
        exchangeMic: "ARCX",
      },
      {
        symbol: "VTI",
        name: "Vanguard Total Stock",
        description: "全美股市",
        exchangeMic: "ARCX",
      },
      {
        symbol: "VEA",
        name: "Vanguard FTSE Developed",
        description: "美国以外发达市场",
        exchangeMic: "ARCX",
      },
      {
        symbol: "VWO",
        name: "Vanguard FTSE Emerging",
        description: "新兴市场",
        exchangeMic: "ARCX",
      },
    ],
  },
];

interface BenchmarkSymbolSelectorProps {
  onSelect: (symbol: { id: string; name: string }) => void;
  className?: string;
  iconOnly?: boolean;
}

export function BenchmarkSymbolSelector({
  onSelect,
  className,
  iconOnly = false,
}: BenchmarkSymbolSelectorProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Query for dynamic ticker search
  const {
    data: searchResults,
    isLoading,
    isError,
  } = useQuery<SymbolSearchResult[], Error>({
    queryKey: ["benchmark-ticker-search", searchQuery],
    queryFn: () => searchTicker(searchQuery),
    enabled: searchQuery?.length > 2, // Only search when query is longer than 2 characters
  });

  // Sort search results by score if available
  const sortedSearchResults = searchResults?.sort((a, b) => b.score - a.score) ?? [];

  // Filter out search results that are already in predefined benchmarks
  const existingSymbols = BENCHMARKS.flatMap((group) => group.items.map((item) => item.symbol));
  const filteredSearchResults = sortedSearchResults.filter(
    (result) => !existingSymbols.includes(result.symbol),
  );

  const handleBenchmarkSelect = (benchmark: {
    symbol: string;
    name: string;
    exchangeMic?: string;
  }) => {
    setValue(benchmark.name);
    onSelect({ id: benchmark.symbol, name: benchmark.name });
    setOpen(false);
    setSearchQuery(""); // Clear search when selecting
  };

  const handleSearchResultSelect = (ticker: SymbolSearchResult) => {
    setValue(ticker.longName || ticker.symbol);
    onSelect({
      id: ticker.existingAssetId || ticker.symbol,
      name: ticker.longName || ticker.symbol,
    });
    setOpen(false);
    setSearchQuery(""); // Clear search when selecting
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={iconOnly ? "添加基准" : undefined}
          className={cn(
            "bg-secondary/30 hover:bg-muted/80 flex items-center gap-1.5 rounded-md border-dashed text-sm font-medium",
            iconOnly ? "h-9 w-9 p-0" : "h-8 px-3 py-1",
            className,
          )}
          size={iconOnly ? "icon" : "sm"}
        >
          <Icons.TrendingUp className="h-4 w-4" />
          {!iconOnly && "添加基准"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="搜索基准或代码…"
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList className="max-h-[300px] overflow-y-auto">
            <CommandEmpty>
              {isLoading ? "搜索中…" : "未找到匹配的基准或代码。"}
            </CommandEmpty>

            {/* Predefined benchmark groups */}
            {BENCHMARKS.map((group) => (
              <CommandGroup
                key={group.group}
                heading={group.group}
                className="[&_[cmdk-group-heading]]:bg-popover [&_[cmdk-group-heading]]:border-border/10 [&_[cmdk-group-heading]]:sticky [&_[cmdk-group-heading]]:top-0 [&_[cmdk-group-heading]]:z-10 [&_[cmdk-group-heading]]:border-b"
              >
                {group.items
                  .filter(
                    (benchmark) =>
                      searchQuery.length === 0 ||
                      benchmark.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      benchmark.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      benchmark.description.toLowerCase().includes(searchQuery.toLowerCase()),
                  )
                  .map((benchmark) => (
                    <CommandItem
                      key={benchmark.symbol}
                      value={`${benchmark.name} ${benchmark.symbol}`}
                      onSelect={() => handleBenchmarkSelect(benchmark)}
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <span className="font-medium">{benchmark.name}</span>
                          <span className="text-muted-foreground ml-2 text-xs">
                            {benchmark.symbol}
                          </span>
                        </div>
                        <span className="text-muted-foreground text-xs">
                          {benchmark.description}
                        </span>
                      </div>
                      <Icons.Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          value === benchmark.name ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            ))}

            {/* Loading state for search results */}
            {isLoading && searchQuery.length > 2 && (
              <CommandGroup
                heading="Search Results"
                className="[&_[cmdk-group-heading]]:bg-popover [&_[cmdk-group-heading]]:border-border/10 [&_[cmdk-group-heading]]:sticky [&_[cmdk-group-heading]]:top-0 [&_[cmdk-group-heading]]:z-10 [&_[cmdk-group-heading]]:border-b"
              >
                <div className="space-y-2 p-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </CommandGroup>
            )}

            {/* Error state for search results */}
            {isError && searchQuery.length > 2 && (
              <CommandGroup
                heading="Search Results"
                className="[&_[cmdk-group-heading]]:bg-popover [&_[cmdk-group-heading]]:border-border/10 [&_[cmdk-group-heading]]:sticky [&_[cmdk-group-heading]]:top-0 [&_[cmdk-group-heading]]:z-10 [&_[cmdk-group-heading]]:border-b"
              >
                <div className="text-muted-foreground p-4 text-sm">
                  Error searching for symbols. Please try again.
                </div>
              </CommandGroup>
            )}

            {/* Dynamic search results */}
            {!isLoading &&
              !isError &&
              filteredSearchResults.length > 0 &&
              searchQuery.length > 2 && (
                <CommandGroup
                  heading="Search Results"
                  className="[&_[cmdk-group-heading]]:bg-popover [&_[cmdk-group-heading]]:border-border/10 [&_[cmdk-group-heading]]:sticky [&_[cmdk-group-heading]]:top-0 [&_[cmdk-group-heading]]:z-10 [&_[cmdk-group-heading]]:border-b"
                >
                  {filteredSearchResults.slice(0, 8).map((ticker) => (
                    <CommandItem
                      key={ticker.symbol}
                      value={ticker.symbol}
                      onSelect={() => handleSearchResultSelect(ticker)}
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <span className="font-medium">{ticker.longName || ticker.symbol}</span>
                          <span className="text-muted-foreground ml-2 text-xs">
                            {ticker.symbol}
                          </span>
                        </div>
                        {ticker.exchange && (
                          <span className="text-muted-foreground text-xs">
                            {ticker.exchangeName || getExchangeDisplayName(ticker.exchange)}
                          </span>
                        )}
                      </div>
                      <Icons.Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          value === (ticker.longName || ticker.symbol)
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
