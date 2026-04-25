import { getDynamicNavItems, subscribeToNavigationUpdates } from "@/addons/addons-runtime-context";
import { Icons } from "@wealthfolio/ui/components/ui/icons";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export interface NavLink {
  title: string;
  href: string;
  icon?: React.ReactNode;
  keywords?: string[];
  label?: string; // Optional descriptive label for launcher/search
}

export interface NavigationProps {
  primary: NavLink[];
  secondary?: NavLink[];
  addons?: NavLink[];
}

export function useNavigation() {
  const { t } = useTranslation("nav");
  const [dynamicItems, setDynamicItems] = useState<NavigationProps["addons"]>([]);

  // Subscribe to navigation updates from addons
  useEffect(() => {
    const updateDynamicItems = () => {
      const itemsFromRuntime = getDynamicNavItems();
      setDynamicItems(itemsFromRuntime);
    };

    // Initial load
    updateDynamicItems();

    // Subscribe to updates
    const unsubscribe = subscribeToNavigationUpdates(updateDynamicItems);

    return () => {
      unsubscribe();
    };
  }, []);

  const staticNavigation = useMemo<NavigationProps>(
    () => ({
      primary: [
        {
          icon: <Icons.Dashboard className="size-6" />,
          title: t("primary.dashboard.title"),
          href: "/dashboard",
          keywords: ["home", "overview", "summary"],
          label: t("primary.dashboard.label"),
        },
        {
          icon: <Icons.Insight className="size-6" />,
          title: t("primary.insights.title"),
          href: "/insights",
          keywords: ["insights", "Analytics"],
          label: t("primary.insights.label"),
        },
        {
          icon: <Icons.Holdings className="size-6" />,
          title: t("primary.holdings.title"),
          href: "/holdings",
          keywords: ["Holdings", "portfolio", "assets", "positions", "stocks"],
          label: t("primary.holdings.label"),
        },
        {
          icon: <Icons.Activity className="size-6" />,
          title: t("primary.activities.title"),
          href: "/activities",
          keywords: ["transactions", "trades", "history"],
          label: t("primary.activities.label"),
        },
        {
          icon: <Icons.Sparkles className="size-6" />,
          title: t("primary.assistant.title"),
          href: "/assistant",
          keywords: ["ai", "assistant", "chat", "help", "ask"],
          label: t("primary.assistant.label"),
        },
      ],
      secondary: [
        {
          icon: <Icons.Settings className="size-6" />,
          title: t("secondary.settings.title"),
          href: "/settings",
          keywords: ["preferences", "config", "configuration"],
        },
      ],
    }),
    [t],
  );

  // Combine static navigation items with addons grouped separately
  const navigation: NavigationProps = {
    primary: staticNavigation.primary,
    secondary: staticNavigation.secondary,
    addons: dynamicItems,
  };

  return navigation;
}

export function isPathActive(pathname: string, href: string): boolean {
  if (!href) {
    return false;
  }

  const ensureLeadingSlash = href.startsWith("/") ? href : `/${href}`;
  const normalize = (value: string) => {
    if (value.length > 1 && value.endsWith("/")) {
      return value.slice(0, -1);
    }
    return value;
  };

  const normalizedHref = normalize(ensureLeadingSlash);
  const normalizedPath = normalize(pathname);

  if (normalizedHref === "/") {
    return normalizedPath === "/";
  }

  // Dashboard and Net Worth are grouped together
  if (normalizedHref === "/dashboard") {
    return (
      normalizedPath === "/" || normalizedPath === "/dashboard" || normalizedPath === "/net-worth"
    );
  }

  return normalizedPath === normalizedHref || normalizedPath.startsWith(`${normalizedHref}/`);
}
