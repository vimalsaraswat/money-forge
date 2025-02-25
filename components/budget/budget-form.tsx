"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useActionState, useState } from "react";
import { handleBudget } from "@/actions/budget";
import InputWithLabel from "../forms/InputWithLabel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import CategorySelect from "../forms/category-select";
import { TransactionEnum } from "@/types";

export default function AddBudget({
  triggerButton,
}: {
  triggerButton?: React.ReactNode;
}) {
  const initialFormState = {
    category: "",
    amount: "",
    categoryId: "",
    startDate: new Date()?.toISOString()?.split("T")[0],
    period: "",
    description: "",
  };

  const [state, action, isPending] = useActionState(handleBudget, null);
  const [formState, setFormState] = useState(initialFormState);
  const [showDialog, setShowDialog] = useState(false);

  const errors = state?.errors;

  const handleCloseDialog = () => {
    setFormState(initialFormState);
    setShowDialog(false);
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        {triggerButton ? (
          triggerButton
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Budget
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Budget</DialogTitle>
          <DialogDescription>
            Set a new budget for a specific category
          </DialogDescription>
        </DialogHeader>
        <form action={action}>
          <div className="space-y-4">
            <InputWithLabel label="Category">
              <CategorySelect
                selectedCategory={formState?.categoryId || ""}
                type={TransactionEnum.EXPENSE}
                name="category"
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
                    startDate: new Date(date || new Date())
                      ?.toISOString()
                      ?.split("T")[0],
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
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </InputWithLabel>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button type="submit">
              {isPending ? "Adding..." : "Add Budget"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
