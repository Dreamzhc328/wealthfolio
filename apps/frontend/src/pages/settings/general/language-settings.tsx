import { useTranslation } from "react-i18next";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@wealthfolio/ui/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wealthfolio/ui/components/ui/select";

import { supportedLngs } from "@/lib/i18n";

export function LanguageSettings() {
  const { t, i18n } = useTranslation("settings");

  const current = (supportedLngs as readonly string[]).includes(i18n.resolvedLanguage ?? "")
    ? (i18n.resolvedLanguage as string)
    : "zh-CN";

  const handleChange = (value: string) => {
    void i18n.changeLanguage(value);
  };

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className="text-lg">{t("general.language.title")}</CardTitle>
          <CardDescription>{t("general.language.description")}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Select value={current} onValueChange={handleChange}>
          <SelectTrigger className="w-[300px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="zh-CN">{t("general.language.options.zhCN")}</SelectItem>
            <SelectItem value="en">{t("general.language.options.en")}</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
