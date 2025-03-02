"use client";

import { handleBudget } from "@/actions/budget";
import CategorySelect from "@/components/forms/category-select";
import InputWithLabel from "@/components/forms/InputWithLabel";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BudgetType, PeriodEnum, TransactionEnum } from "@/types";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import Spinner from "../spinner";

export default function BudgetForm({
  budget,
  editMode,
}: {
  budget: BudgetType;
  editMode: boolean;
}) {
  const initialFormState = {
    amount: String(budget?.amount) ?? "",
    categoryId: budget?.categoryId ?? "",
    startDate:
      budget?.startDate?.toDateString() ?? new Date()?.toDateString() ?? "",
    period: budget?.period ?? PeriodEnum.MONTHLY,
  };

  const [state, action, isPending] = useActionState(handleBudget, {
    budgetId: budget?.id ?? "",
    message: "",
    success: false,
  });
  const [formState, setFormState] = useState(initialFormState);

  const router = useRouter();

  const errors = state?.errors;

  const formAction = (formData: FormData) => {
    if (JSON.stringify(initialFormState) === JSON.stringify(formState)) {
      toast.info("No changes made");
      return;
    }
    action(formData);
  };

  useEffect(() => {
    if (state?.message?.length) {
      if (state?.success) {
        toast.success(state?.message);
      } else {
        toast.error(state?.message);
      }
    }
    if (state?.success) {
      router.replace("/dashboard/budgets");
    }
  }, [state]);
  console.log(state, initialFormState, budget);

  return (
    <>
      {state?.success ? (
        <Spinner />
      ) : (
        <form action={formAction}>
          <div className="space-y-4">
            <InputWithLabel label="Category" error={errors?.categoryId?.[0]}>
              <CategorySelect
                selectedCategory={formState?.categoryId || ""}
                type={TransactionEnum.EXPENSE}
                name="categoryId"
              />
            </InputWithLabel>

            <InputWithLabel
              label="Amount"
              id="amount"
              name="amount"
              type="number"
              placeholder="Enter budget limit"
              value={formState?.amount}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  amount: e.target.value,
                })
              }
              error={errors?.amount?.[0]}
            />

            <>
              <InputWithLabel
                variant="date"
                label="Start Date"
                mode="single"
                selected={new Date(formState?.startDate)}
                onSelect={(date) =>
                  setFormState({
                    ...formState,
                    startDate: new Date(date || new Date())?.toDateString(),
                  })
                }
                disabled={(date) => date < new Date("1900-01-01")}
                error={errors?.startDate?.[0]}
              />
              <input
                className="hidden"
                name="startDate"
                defaultValue={formState?.startDate}
              />
            </>

            <InputWithLabel label="Period" error={errors?.period?.[0]}>
              <Select
                name="period"
                value={formState?.period}
                onValueChange={(value) =>
                  setFormState({
                    ...formState,
                    period: value as PeriodEnum,
                  })
                }
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PeriodEnum.MONTHLY}>Monthly</SelectItem>
                  <SelectItem value={PeriodEnum.YEARLY}>Yearly</SelectItem>
                </SelectContent>
              </Select>
            </InputWithLabel>
          </div>

          <div className="flex items-center justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending
                ? editMode
                  ? "Updating..."
                  : "Adding..."
                : editMode
                  ? "Update Budget"
                  : "Add Budget"}
            </Button>
          </div>
        </form>
      )}
    </>
  );
}
