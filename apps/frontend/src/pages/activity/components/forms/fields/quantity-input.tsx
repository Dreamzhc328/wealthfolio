import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  QuantityInput as BaseQuantityInput,
} from "@wealthfolio/ui";
import { useFormContext, type FieldPath, type FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface QuantityInputProps<TFieldValues extends FieldValues = FieldValues> {
  name: FieldPath<TFieldValues>;
  label?: string;
  placeholder?: string;
  /** Maximum decimal places (default: 8 for shares) */
  maxDecimalPlaces?: number;
  /** Allow negative values (default: false) */
  allowNegative?: boolean;
}

export function QuantityInput<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  placeholder = "0.00",
  maxDecimalPlaces = 8,
  allowNegative = false,
}: QuantityInputProps<TFieldValues>) {
  const { t } = useTranslation("assets");
  const resolvedLabel = label ?? t("form.fields.quantity");
  const { control } = useFormContext<TFieldValues>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{resolvedLabel}</FormLabel>
          <FormControl>
            <BaseQuantityInput
              ref={field.ref}
              name={field.name}
              value={field.value}
              onValueChange={field.onChange}
              placeholder={placeholder}
              maxDecimalPlaces={maxDecimalPlaces}
              allowNegative={allowNegative}
              aria-label={resolvedLabel}
              data-testid={`${name.toLowerCase().replace(/\s+/g, "-")}-input`}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
