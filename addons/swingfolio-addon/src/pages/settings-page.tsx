import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Icons,
  Label,
  Page,
  PageContent,
  PageHeader,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wealthfolio/ui";
import type { AddonContext } from "@wealthfolio/addon-sdk";
import { useSwingPreferences } from "../hooks/use-swing-preferences";

interface SettingsPageProps {
  ctx: AddonContext;
}

export default function SettingsPage({ ctx }: SettingsPageProps) {
  const { preferences, updatePreferences, isUpdating } = useSwingPreferences(ctx);

  const handleLotMethodChange = (method: "FIFO" | "LIFO" | "AVERAGE") => {
    updatePreferences({ lotMatchingMethod: method });
  };

  const handleDefaultDateRangeChange = (range: any) => {
    updatePreferences({ defaultDateRange: range });
  };

  const handleIncludeFeesChange = (checked: boolean) => {
    updatePreferences({ includeFees: checked });
  };

  const handleIncludeDividendsChange = (checked: boolean) => {
    updatePreferences({ includeDividends: checked });
  };

  const pageDescription = "配置您的短线交易分析偏好";

  return (
    <Page>
      <PageHeader
        heading="Swingfolio 设置"
        text={pageDescription}
        actions={
          <Button
            variant="outline"
            onClick={() => ctx.api.navigation.navigate("/addons/swingfolio")}
          >
            <Icons.ArrowLeft className="mr-2 h-4 w-4" />
            返回仪表盘
          </Button>
        }
      />

      <PageContent className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>交易匹配</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="lot-method">批次匹配方法</Label>
              <Select value={preferences.lotMatchingMethod} onValueChange={handleLotMethodChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FIFO">FIFO（先进先出）</SelectItem>
                  <SelectItem value="LIFO">LIFO（后进先出）</SelectItem>
                  <SelectItem value="AVERAGE">移动平均成本</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-muted-foreground mt-1 text-xs">
                用于匹配买入与卖出订单以计算盈亏的方法：
                <br />
                • FIFO：优先匹配最早买入的批次
                <br />
                • LIFO：优先匹配最近买入的批次
                <br />• 移动平均成本：使用所有买入的加权平均价
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>显示设置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="default-range">默认时间范围</Label>
              <Select
                value={preferences.defaultDateRange}
                onValueChange={handleDefaultDateRangeChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1M">1 个月</SelectItem>
                  <SelectItem value="3M">3 个月</SelectItem>
                  <SelectItem value="6M">6 个月</SelectItem>
                  <SelectItem value="YTD">今年至今</SelectItem>
                  <SelectItem value="1Y">1 年</SelectItem>
                  <SelectItem value="ALL">全部</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-muted-foreground mt-1 text-xs">
                打开仪表盘时默认显示的时间范围
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>计算设置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-fees"
                checked={preferences.includeFees}
                onCheckedChange={handleIncludeFeesChange}
              />
              <Label htmlFor="include-fees">将费用计入盈亏</Label>
            </div>
            <p className="text-muted-foreground text-xs">
              启用后，交易费用将从已实现盈亏中扣除
            </p>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-dividends"
                checked={preferences.includeDividends}
                onCheckedChange={handleIncludeDividendsChange}
              />
              <Label htmlFor="include-dividends">将分红计入业绩</Label>
            </div>
            <p className="text-muted-foreground text-xs">
              启用后，分红将计入总收益
            </p>
          </CardContent>
        </Card>

        {isUpdating && (
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Icons.Spinner className="h-4 w-4 animate-spin" />
            正在保存设置...
          </div>
        )}
      </PageContent>
    </Page>
  );
}
