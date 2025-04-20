"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription, // Optional: Add description
} from "@/components/ui/dialog";
import BudgetForm from "./budget-form";
import { BudgetType } from "@/types";

interface BudgetModalProps {
  trigger: React.ReactNode;
  mode: "new" | "edit";
  budget?: BudgetType;
}

export function BudgetModal({ trigger, mode, budget }: BudgetModalProps) {
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
            {mode === "new" ? "Add New Budget" : "Edit Budget"}
          </DialogTitle>
          <DialogDescription>
            {mode === "new"
              ? "Set up a new budget category."
              : "Modify your existing budget."}
          </DialogDescription>
        </DialogHeader>
        <div className="pt-4">
          <BudgetForm
            editMode={mode === "edit"}
            budget={budget}
            onSuccess={handleSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
