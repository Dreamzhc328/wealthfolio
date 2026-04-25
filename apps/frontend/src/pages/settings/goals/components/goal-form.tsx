import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as z from "zod";

import { Button } from "@wealthfolio/ui/components/ui/button";
import { Switch } from "@wealthfolio/ui/components/ui/switch";

import { Icons } from "@wealthfolio/ui/components/ui/icons";

import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@wealthfolio/ui/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@wealthfolio/ui/components/ui/form";
import { Input } from "@wealthfolio/ui/components/ui/input";

import { newGoalSchema } from "@/lib/schemas";
import { useGoalMutations } from "@/pages/settings/goals/use-goal-mutations";
import { MoneyInput } from "@wealthfolio/ui";

type NewGoal = z.infer<typeof newGoalSchema>;

interface GoalFormlProps {
  defaultValues?: NewGoal;
  onSuccess?: () => void;
}

export function GoalForm({ defaultValues, onSuccess = () => undefined }: GoalFormlProps) {
  const { t } = useTranslation("settings");
  const { addGoalMutation, updateGoalMutation } = useGoalMutations();

  const form = useForm<NewGoal>({
    resolver: zodResolver(newGoalSchema),
    defaultValues,
  });

  function onSubmit(data: NewGoal) {
    const { id, ...rest } = data;
    if (id) {
      return updateGoalMutation.mutate({ id, ...rest }, { onSuccess });
    }
    return addGoalMutation.mutate(data, { onSuccess });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <DialogHeader>
          <DialogTitle>
            {" "}
            {defaultValues?.id ? t("goals.form.updateTitle") : t("goals.form.addTitle")}
          </DialogTitle>
          <DialogDescription>
            {defaultValues?.id ? t("goals.form.updateDescription") : t("goals.form.addDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-10 p-4">
          {/* add input hidden for id */}
          <input type="hidden" name="id" />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("goals.form.name")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("goals.form.namePlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("goals.form.description")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("goals.form.descriptionPlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="targetAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("goals.form.targetAmount")}</FormLabel>
                <FormControl>
                  <MoneyInput placeholder={t("goals.form.targetAmountPlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {defaultValues?.id ? (
            <FormField
              control={form.control}
              name="isAchieved"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="space-y-0 pl-2">{t("goals.form.achieved")}</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}
        </div>
        <DialogFooter className="gap-2">
          <DialogTrigger asChild>
            <Button variant="outline">{t("common.cancel")}</Button>
          </DialogTrigger>
          <Button type="submit">
            <Icons.Plus className="h-4 w-4" />
            <span>{defaultValues?.id ? t("goals.form.updateTitle") : t("goals.form.addTitle")}</span>
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
