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
import { deleteTransaction, handleTransaction } from "@/actions";
import { CategoryEnum, TransactionType } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { IndianRupee, Pencil, Trash } from "lucide-react";

export default function TransactionForm({
  transaction,
  editMode,
}: {
  transaction?: TransactionType;
  editMode?: boolean;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const initialState = {
    success: false,
    errors: {},
    message: "",
    initialValues: {
      id: transaction?.id ?? "",
      type: transaction?.type ?? "",
      amount: String(transaction?.amount ?? ""),
      category: transaction?.category ?? "",
      date:
        transaction?.date?.toISOString()?.split("T")[0] ??
        new Date()?.toISOString()?.split("T")[0],
      description: transaction?.description ?? "",
    },
  };
  const [state, action, isPending] = useActionState(
    handleTransaction,
    initialState,
  );
  const errors = state?.errors;
  const values = state?.initialValues;

  const categories = Object.values(CategoryEnum);

  useEffect(() => {
    if (state?.success) {
      setDialogOpen(false);
    }
  }, [state?.success, setDialogOpen]);

  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
      <DialogTrigger asChild>
        {editMode ? (
          <Button variant="outline" size="icon">
            <Pencil />
          </Button>
        ) : (
          <Button variant="outline">Add Transaction</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{editMode ? "Edit" : "Add"} Transaction</DialogTitle>
          <DialogDescription>
            {editMode
              ? "Update this transaction's details."
              : "Add a new transaction to track your expenses and income."}
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
            <div className="relative">
              <IndianRupee className="absolute top-2 left-3" size={20} />
              <Input
                id="amount"
                type="number"
                name="amount"
                placeholder="$200"
                className="pl-7"
                min={1}
                defaultValue={values?.amount}
                required
              />
            </div>
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
                <SelectValue
                  placeholder="Select category"
                  className="capitalize"
                />
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
              onChange={(e) => console.log(e.target.value)}
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
              {isPending
                ? editMode
                  ? "Updating..."
                  : "Adding..."
                : editMode
                  ? "Update Transaction"
                  : "Add Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteTransaction({
  transactionId,
}: {
  transactionId: string;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const [state, action, isPending] = useActionState(deleteTransaction, {
    success: false,
    message: "",
    initialValues: {
      id: transactionId,
    },
  });

  useEffect(() => {
    if (state?.success) {
      setDialogOpen(false);
    }
  }, [state?.success, setDialogOpen]);

  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Delete Transaction</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this transaction? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-4">
          <DialogFooter>
            <Button type="submit" disabled={isPending} variant="destructive">
              {isPending ? "Deleting..." : "Delete Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
