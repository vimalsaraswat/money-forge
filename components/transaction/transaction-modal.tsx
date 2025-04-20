"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import TransactionForm from "./transaction-form";
import { TransactionType } from "@/types";

interface TransactionModalProps {
  trigger: React.ReactNode;
  mode: "new" | "edit";
  transaction?: TransactionType;
}

export function TransactionModal({
  trigger,
  mode,
  transaction,
}: TransactionModalProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[450px] md:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "new" ? "Add New Transaction" : "Edit Transaction"}
          </DialogTitle>
          {/* Optional Description */}
          <DialogDescription>
            {mode === "new"
              ? "Enter the details for your new transaction."
              : "Update the details of this transaction."}
          </DialogDescription>
        </DialogHeader>
        <div className="pt-4">
          {/* Add some padding */}
          <TransactionForm
            editMode={mode === "edit"}
            transaction={transaction}
            onSuccess={handleSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
