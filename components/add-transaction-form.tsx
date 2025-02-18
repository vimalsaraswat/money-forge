"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTransaction } from "@/actions";
import { CategoryEnum } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export default function AddTransactionForm() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [state, action, isPending] = useActionState(createTransaction, null);
  const errors = state?.errors;
  const values = state?.initialValues;
  console.log({
    state,
  });

  const categories = Object.values(CategoryEnum);

  useEffect(() => {
    if (state?.success) {
      setDialogOpen(false);
    }
  }, [state?.success, setDialogOpen]);

  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Transaction</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>
            Add a new transaction to track your expenses and income.
          </DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-4">
          <div>
            <div className="space-y-2">
              <Label>Transaction Type</Label>
              <RadioGroup
                defaultValue={values?.type}
                required
                name="type"
                className="flex gap-3"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="expense" id="expense" />
                  <Label htmlFor="expense">Expense</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="income" id="income" />
                  <Label htmlFor="income">Income</Label>
                </div>
              </RadioGroup>
            </div>
            {errors?.type && (
              <p className="text-destructive text-xs text-end">
                {errors?.type}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              name="amount"
              placeholder="$200"
              min={1}
              defaultValue={values?.amount}
              required
            />
            {errors?.amount && (
              <p className="text-destructive text-xs text-end">
                {errors?.amount}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select name="category" defaultValue={values?.category} required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category, index) => (
                  <SelectItem
                    key={index}
                    value={category}
                    className="capitalize"
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.category && (
              <p className="text-destructive text-xs text-end">
                {errors?.category}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              name="date"
              defaultValue={values?.date}
              required
            />
            {errors?.date && (
              <p className="text-destructive text-xs text-end">
                {errors?.date}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
