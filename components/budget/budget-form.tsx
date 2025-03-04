"use client";

import { deleteBudget, handleBudget } from "@/actions/budget";
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
import { BudgetType, PeriodEnum } from "@/types";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import Spinner from "../spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Trash } from "lucide-react";

export default function BudgetForm({
  budget,
  editMode,
}: {
  budget?: BudgetType;
  editMode?: boolean;
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
                type="expense"
                onChange={(categoryId) =>
                  setFormState((prevState) => ({
                    ...prevState,
                    categoryId,
                  }))
                }
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
                value={formState?.startDate}
                onChange={() => {}}
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

export function DeleteBudget({ budgetId }: { budgetId: string }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const [state, action, isPending] = useActionState(
    deleteBudget.bind(null, budgetId),
    null,
  );

  useEffect(() => {
    if (state?.message?.length) {
      toast.success(state?.message);
    }
    if (state?.success) {
      setDialogOpen(false);
    }
  }, [state]);

  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Delete Budget</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this budget? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-4">
          <DialogFooter>
            <Button type="submit" disabled={isPending} variant="destructive">
              {isPending ? "Deleting..." : "Delete Budget"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
