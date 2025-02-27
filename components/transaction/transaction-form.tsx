"use client";

import { useActionState, useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { deleteTransaction, handleTransaction } from "@/actions";
import { TransactionType } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import InputWithLabel from "../forms/InputWithLabel";
import CategorySelect from "../forms/category-select";
import { useRouter } from "next/navigation";
import Spinner from "../spinner";
import { cn } from "@/lib/utils";

export default function TransactionForm({
  transaction,
  editMode,
}: {
  transaction?: TransactionType;
  editMode?: boolean;
}) {
  const initialState = {
    success: false,
    errors: {},
    message: "",
    initialValues: {
      id: transaction?.id ?? "",
      type: transaction?.type ?? "",
      amount: String(transaction?.amount ?? ""),
      date: transaction?.date?.toISOString()?.split("T")[0] ?? "",
      categoryId: transaction?.categoryId ?? "",
      description: transaction?.description ?? "",
    },
  };
  const [type, setType] = useState(initialState?.initialValues?.type);
  const [date, setDate] = useState(initialState?.initialValues?.date);
  const [state, action, isPending] = useActionState(
    handleTransaction,
    initialState,
  );
  const router = useRouter();
  const errors = state?.errors;
  const values = state?.initialValues;

  useEffect(() => {
    if (state?.message?.length) {
      toast(state?.message);
    }
    if (state?.success) {
      router.replace("/dashboard/transactions");
    }
  }, [state]);
  return (
    <>
      {state?.success ? (
        <Spinner />
      ) : (
        <form action={action} className="space-y-4 container max-w-md mx-auto">
          <div className="flex flex-col gap-2">
            <Label>Transaction Type</Label>
            <RadioGroup
              defaultValue={values?.type}
              onValueChange={(value) => setType(value)}
              name="type"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "hover:bg-background justify-evenly",
              )}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="expense" />
                <Label htmlFor="expense">Expense</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="income" id="income" />
                <Label htmlFor="income">Income</Label>
              </div>
            </RadioGroup>
            {errors?.type && (
              <p className="text-destructive text-xs text-end">
                {errors?.type}
              </p>
            )}
          </div>

          <InputWithLabel
            label="Amount"
            id="amount"
            name="amount"
            type="number"
            min={1}
            defaultValue={values?.amount}
            placeholder="Enter amount"
            error={errors?.amount?.[0]}
            required
          />

          <InputWithLabel label="Category">
            <CategorySelect
              selectedCategory={values?.categoryId || ""}
              type={type}
              name="categoryId"
            />
          </InputWithLabel>

          <InputWithLabel
            variant="date"
            label="Date"
            mode="single"
            selected={new Date(date || new Date())}
            onSelect={(date) =>
              setDate(
                new Date(date || new Date())?.toISOString()?.split("T")[0],
              )
            }
            disabled={(date) =>
              date > new Date() || date < new Date("1900-01-01")
            }
            initialFocus
            error={errors?.date?.[0]}
          />
          <input className="hidden" name="date" defaultValue={date} />

          <InputWithLabel
            variant="textarea"
            label="Notes (Optional)"
            id="notes"
            defaultValue={values?.description}
            placeholder="Add notes about this transaction"
            error={errors?.description?.[0]}
          />

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
      )}
    </>
  );
}

export function DeleteTransaction({
  transactionId,
}: {
  transactionId: string;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const [state, action, isPending] = useActionState(
    deleteTransaction.bind(null, transactionId),
    null,
  );

  useEffect(() => {
    if (state?.message?.length ?? -1 > 0) {
      toast(state?.message);
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
