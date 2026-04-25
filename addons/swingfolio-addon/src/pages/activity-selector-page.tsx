import React, { useState, useMemo } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Icons,
  Input,
  Page,
  PageContent,
  PageHeader,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from "@wealthfolio/ui";
import type { AddonContext } from "@wealthfolio/addon-sdk";
import { useSwingActivities } from "../hooks/use-swing-activities";
import { useSwingPreferences } from "../hooks/use-swing-preferences";
import { format } from "date-fns";

interface ActivitySelectorPageProps {
  ctx: AddonContext;
}

export default function ActivitySelectorPage({ ctx }: ActivitySelectorPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedActivities, setSelectedActivities] = useState<Set<string>>(new Set());

  const { data: activities, isLoading, error } = useSwingActivities(ctx);
  const { preferences, updatePreferences, isUpdating } = useSwingPreferences(ctx);

  // Initialize selected activities from preferences
  React.useEffect(() => {
    if (preferences.selectedActivityIds.length > 0) {
      setSelectedActivities(new Set(preferences.selectedActivityIds));
    }
  }, [preferences.selectedActivityIds]);

  // Get unique accounts for filter
  const accounts = useMemo(() => {
    if (!activities) return [];
    const uniqueAccounts = Array.from(new Set(activities.map((a) => a.accountName)));
    return uniqueAccounts.map((name) => ({
      name,
      id: activities.find((a) => a.accountName === name)?.accountId || "",
    }));
  }, [activities]);

  // Filter activities
  const filteredActivities = useMemo(() => {
    if (!activities) return [];

    return activities.filter((activity) => {
      const matchesSearch =
        searchTerm === "" ||
        activity.assetSymbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (activity.assetName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

      const matchesAccount = selectedAccount === "all" || activity.accountName === selectedAccount;
      const matchesType = selectedType === "all" || activity.activityType === selectedType;

      return matchesSearch && matchesAccount && matchesType;
    });
  }, [activities, searchTerm, selectedAccount, selectedType]);

  const handleToggleActivity = (activityId: string) => {
    const newSelected = new Set(selectedActivities);
    if (newSelected.has(activityId)) {
      newSelected.delete(activityId);
    } else {
      newSelected.add(activityId);
    }
    setSelectedActivities(newSelected);
  };

  const handleSelectAll = () => {
    const allIds = filteredActivities.map((a) => a.id);
    setSelectedActivities(new Set([...selectedActivities, ...allIds]));
  };

  const handleDeselectAll = () => {
    const filteredIds = new Set(filteredActivities.map((a) => a.id));
    const newSelected = new Set([...selectedActivities].filter((id) => !filteredIds.has(id)));
    setSelectedActivities(newSelected);
  };

  const handleToggleSwingTag = (enabled: boolean) => {
    updatePreferences({ includeSwingTag: enabled });
  };

  const handleSaveSelection = () => {
    updatePreferences({
      selectedActivityIds: Array.from(selectedActivities),
    });
    ctx.api.navigation.navigate("/addons/swingfolio");
  };

  const selectedCount = selectedActivities.size;
  const filteredSelectedCount = filteredActivities.filter((a) =>
    selectedActivities.has(a.id),
  ).length;

  if (isLoading) {
    return <ActivitySelectorSkeleton />;
  }

  const pageDescription =
    "选择要纳入短线组合分析的交易活动";

  if (error || !activities) {
    return (
      <Page>
        <PageHeader
          heading="选择活动"
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
        <PageContent>
          <div className="flex h-[calc(100vh-200px)] items-center justify-center">
            <div className="text-center">
              <Icons.AlertCircle className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <h3 className="mb-2 text-lg font-semibold">活动加载失败</h3>
              <p className="text-muted-foreground mb-4">
                {error?.message || "无法加载交易活动"}
              </p>
              <Button onClick={() => ctx.api.navigation.navigate("/addons/swingfolio")}>
                返回仪表盘
              </Button>
            </div>
          </div>
        </PageContent>
      </Page>
    );
  }

  const headerActions = (
    <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
      <Button variant="outline" onClick={() => ctx.api.navigation.navigate("/addons/swingfolio")}>
        <Icons.ArrowLeft className="mr-2 h-4 w-4" />
        返回仪表盘
      </Button>
      <Button onClick={handleSaveSelection} disabled={isUpdating}>
        {isUpdating ? (
          <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.Save className="mr-2 h-4 w-4" />
        )}
        保存选择
      </Button>
    </div>
  );

  return (
    <Page>
      <PageHeader heading="选择活动" text={pageDescription} actions={headerActions} />
      <PageContent>
        <Card>
          <CardHeader>
            <CardTitle>自动选择规则</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="swing-tag"
                checked={preferences.includeSwingTag}
                onCheckedChange={handleToggleSwingTag}
              />
              <label htmlFor="swing-tag" className="text-sm font-medium">
                自动纳入备注含 &quot;Swing&quot; 标签的活动
              </label>
            </div>
            <p className="text-muted-foreground mt-2 text-xs">
              备注中含 &quot;swing&quot; 字样的活动将被自动纳入
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>手动选择</span>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <span>
                  当前已选 {filteredSelectedCount} / {filteredActivities.length}
                </span>
                <span>•</span>
                <span>共选中 {selectedCount}</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="flex-1">
                <Input
                  placeholder="按代码或名称搜索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="全部账户" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部账户</SelectItem>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.name}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="全部类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类型</SelectItem>
                    <SelectItem value="BUY">买入</SelectItem>
                    <SelectItem value="SELL">卖出</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                全选筛选结果
              </Button>
              <Button variant="outline" size="sm" onClick={handleDeselectAll}>
                取消全选筛选结果
              </Button>
            </div>

            <div className="rounded-lg border">
              <div className="max-h-[600px] overflow-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 sticky top-0">
                    <tr className="border-b">
                      <th className="w-12 p-3 text-left">
                        <Checkbox
                          checked={
                            filteredActivities.length > 0 &&
                            filteredActivities.every((a) => selectedActivities.has(a.id))
                          }
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleSelectAll();
                            } else {
                              handleDeselectAll();
                            }
                          }}
                        />
                      </th>
                      <th className="p-3 text-left">日期</th>
                      <th className="p-3 text-left">类型</th>
                      <th className="p-3 text-left">代码</th>
                      <th className="p-3 text-left">数量</th>
                      <th className="p-3 text-left">价格</th>
                      <th className="p-3 text-left">账户</th>
                      <th className="p-3 text-left">标签</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredActivities.map((activity) => (
                      <tr key={activity.id} className="hover:bg-muted/25 border-b">
                        <td className="p-3">
                          <Checkbox
                            checked={selectedActivities.has(activity.id)}
                            onCheckedChange={() => handleToggleActivity(activity.id)}
                          />
                        </td>
                        <td className="p-3 text-sm">
                          {format(new Date(activity.date), "yyyy-MM-dd")}
                        </td>
                        <td className="p-3">
                          <Badge
                            variant={activity.activityType === "BUY" ? "default" : "secondary"}
                          >
                            {activity.activityType === "BUY" ? "买入" : "卖出"}
                          </Badge>
                        </td>
                        <td className="p-3 font-medium">
                          {activity.assetSymbol}
                          {activity.assetName && (
                            <div className="text-muted-foreground text-xs">
                              {activity.assetName}
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-sm">
                          {Number(activity.quantity ?? 0).toLocaleString()}
                        </td>
                        <td className="p-3 text-sm">
                          {Number(activity.unitPrice ?? 0).toLocaleString("en-US", {
                            style: "currency",
                            currency: activity.currency,
                          })}
                        </td>
                        <td className="p-3 text-sm">{activity.accountName}</td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            {activity.hasSwingTag && (
                              <Badge variant="outline" className="text-xs">
                                Swing
                              </Badge>
                            )}
                            {activity.isSelected && (
                              <Badge variant="default" className="text-xs">
                                已选
                              </Badge>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredActivities.length === 0 && (
              <div className="text-muted-foreground py-8 text-center">
                没有符合当前筛选条件的活动
              </div>
            )}
          </CardContent>
        </Card>
      </PageContent>
    </Page>
  );
}

function ActivitySelectorSkeleton() {
  return (
    <Page>
      <PageHeader
        actions={
          <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
            <Skeleton className="h-10 w-[150px]" />
            <Skeleton className="h-10 w-[140px]" />
          </div>
        }
      >
        <div className="space-y-2">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-5 w-[320px]" />
        </div>
      </PageHeader>

      <PageContent>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[200px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-5 w-[300px]" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[150px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-4 lg:flex-row">
                <Skeleton className="h-10 max-w-sm flex-1" />
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <Skeleton className="h-10 w-[200px]" />
                  <Skeleton className="h-10 w-[150px]" />
                </div>
              </div>
              <Skeleton className="h-[400px] w-full" />
            </div>
          </CardContent>
        </Card>
      </PageContent>
    </Page>
  );
}
