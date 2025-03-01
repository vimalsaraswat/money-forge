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
import { TransactionEnum } from "@/types";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

export default function BudgetForm() {
  const initialFormState = {
    category: "",
    amount: "",
    categoryId: "",
    startDate: new Date()?.toDateString(),
    period: "",
    description: "",
  };

  const [state, action, isPending] = useActionState(handleBudget, null);
  const [formState, setFormState] = useState(initialFormState);

  const router = useRouter();

  const errors = state?.errors;

  useEffect(() => {
    if (state?.message?.length) {
      toast.success(state?.message);
    }
    if (state?.success) {
      router.replace("/dashboard/budgets");
    }
  }, [state]);
  // console.log(state);

  return (
    <form action={action}>
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
            type="date"
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
                period: value as "monthly" | "yearly",
              })
            }
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </InputWithLabel>
      </div>

      <div className="flex items-center justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Adding..." : "Add Budget"}
        </Button>
      </div>
    </form>
  );
}
