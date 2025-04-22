"use client";

import { exportBudgets, exportTransactions } from "@/actions/export";
import InputWithLabel from "@/components/forms/InputWithLabel";
import SubmitButton from "@/components/forms/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { Download } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

// Helper function to trigger CSV download
const downloadCsv = (csvData: string, filename: string) => {
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url); // Clean up
};

export function DataExport() {
  const [
    transactionExportState,
    transactionExportAction,
    isTransactionPending,
  ] = useActionState(exportTransactions, null);
  const [budgetExportState, budgetExportAction, isBudgetPending] =
    useActionState(exportBudgets, null);

  // State for date pickers
  const [startDate, setStartDate] = useState<Date>(
    startOfMonth(subMonths(new Date(), 1)),
  );
  const [endDate, setEndDate] = useState<Date>(
    endOfMonth(subMonths(new Date(), 1)),
  );

  useEffect(() => {
    if (transactionExportState?.success && transactionExportState?.csvData) {
      toast.success("Transaction data downloaded successfully.");
      downloadCsv(
        transactionExportState.csvData,
        transactionExportState.filename || "transactions.csv",
      );
    } else if (
      transactionExportState?.message &&
      !transactionExportState.success
    ) {
      toast.error(transactionExportState.message);
    }
  }, [transactionExportState]);

  useEffect(() => {
    if (budgetExportState?.success && budgetExportState?.csvData) {
      toast.success("Budget data downloaded successfully.");
      downloadCsv(
        budgetExportState.csvData,
        budgetExportState.filename || "budgets.csv",
      );
    } else if (budgetExportState?.message && !budgetExportState.success) {
      toast.error(budgetExportState.message);
    }
  }, [budgetExportState]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Export</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Transaction Export */}
        <form
          action={transactionExportAction}
          className="space-y-4 p-4 border rounded-md"
        >
          <h4 className="font-semibold">Export Transactions</h4>
          <div className="grid sm:grid-cols-2 gap-4">
            <InputWithLabel
              variant="date"
              label="Start Date"
              mode="single"
              selected={startDate}
              onSelect={(date) => setStartDate(date || new Date())}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              required
            />
            <InputWithLabel
              variant="date"
              label="End Date"
              mode="single"
              selected={endDate}
              onSelect={(date) => setEndDate(date || new Date())}
              disabled={(date) => date > new Date() || date < startDate}
              required
            />

            <input
              className="hidden"
              name="startDate"
              value={startDate?.toDateString()}
              onChange={() => {}}
            />
            <input
              className="hidden"
              name="endDate"
              value={endDate?.toDateString()}
              onChange={() => {}}
            />
          </div>
          <SubmitButton
            loadingLabel="Generating..."
            disabled={isTransactionPending}
          >
            <Download className="mr-2 h-4 w-4" /> Export Transactions
          </SubmitButton>
        </form>

        {/* Budget Export */}
        <form
          action={budgetExportAction}
          className="space-y-4 p-4 border rounded-md"
        >
          <h4 className="font-semibold">Export Budgets</h4>
          <p className="text-sm text-muted-foreground">
            Export your current budget configurations and spending status.
          </p>
          <SubmitButton loadingLabel="Generating..." disabled={isBudgetPending}>
            <Download className="mr-2 h-4 w-4" /> Export Budgets
          </SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
