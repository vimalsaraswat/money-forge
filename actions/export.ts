"use server";

import { auth } from "@/auth";
import { DB } from "@/db/queries";
import { formatDate, generateCsv } from "@/lib/utils";
import { z } from "zod";

const ExportDateRangeSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

type ExportState = {
  success: boolean;
  message?: string;
  csvData?: string;
  filename?: string;
};

export async function exportTransactions(
  prevState: null | ExportState,
  formData: FormData,
): Promise<ExportState> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const rawData = {
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
    };

    const validatedDates = ExportDateRangeSchema.safeParse(rawData);

    if (!validatedDates.success) {
      return {
        success: false,
        message: "Invalid date range selected.",
      };
    }

    const { startDate, endDate } = validatedDates.data;

    // Fetch transactions within the date range for the user
    const userTransactions = await DB.getTransactionsInRange(
      session.user.id,
      startDate,
      endDate,
    );

    if (!userTransactions || userTransactions.length === 0) {
      return {
        success: false,
        message: "No transactions found in this range.",
      };
    }

    const headers = ["Date", "Type", "Category", "Amount", "Description"];

    const formattedData = userTransactions.map((t) => ({
      Date: formatDate(t.date),
      Type: t.type,
      Category: t.category,
      Amount: t.amount,
      Description: t.description || "-",
    }));

    const csvData = generateCsv(formattedData, headers);
    const filename = `moneyforge_transactions_${formatDate(startDate)}_to_${formatDate(endDate)}.csv`;

    return { success: true, csvData, filename };
  } catch (error) {
    console.error("Failed to export transactions:", error);
    return { success: false, message: "Failed to export transactions." };
  }
}

export async function exportBudgets(): Promise<ExportState> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const userBudgets = await DB.getBudgets(session.user.id);

    if (!userBudgets || userBudgets.length === 0) {
      return { success: false, message: "No budgets found to export." };
    }

    const headers = [
      "Category",
      "Period",
      "Budget Amount",
      "Amount Spent",
      "Start Date",
      "End Date",
    ];

    const formattedData = userBudgets.map((b) => ({
      Category: b.category,
      Period: b.period,
      "Budget Amount": b.amount,
      "Amount Spent": b.spent ?? 0,
      "Start Date": formatDate(b.startDate),
      "End Date": formatDate(b.endDate),
    }));

    const csvData = generateCsv(formattedData, headers);
    const filename = `moneyforge_budgets_${new Date().toISOString().split("T")[0]}.csv`;

    return { success: true, csvData, filename };
  } catch (error) {
    console.error("Failed to export budgets:", error);
    return { success: false, message: "Failed to export budgets." };
  }
}
