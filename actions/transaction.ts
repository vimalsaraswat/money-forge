"use server";

import { auth } from "@/auth";
import { DB } from "@/db/queries";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { handleBudgetAlert } from "./alert";
import { TransactionSchema } from "@/types/zod-schema";

type PrevState =
  | {
      transactionId?: string;
      success?: boolean;
      message?: string;
      errors?: {
        amount?: string[];
        type?: string[];
        categoryId?: string[];
        date?: string[];
        description?: string[];
      };
    }
  | undefined
  | null;

export async function handleTransaction(
  prevState: PrevState,
  formData: FormData,
) {
  try {
    const { type, amount, categoryId, date, description } = Object.fromEntries(
      formData,
    ) as Record<string, string>;

    const initialValues = {
      type,
      amount,
      categoryId,
      date,
      description,
    };
    const validatedFields = TransactionSchema.safeParse(initialValues);

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Missing Fields. Failed to add product.",
      };
    }

    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorised",
      };
    }

    const category = await DB.getCategoryById(categoryId);

    if (category?.length !== 1) {
      return {
        success: false,
        meassage: "Category does not exist",
      };
    }
    const transactionData = {
      ...validatedFields.data,
      categoryId: validatedFields?.data?.categoryId,
      description: validatedFields.data?.description ?? "",
      amount: parseFloat(validatedFields.data.amount),
      date: new Date(validatedFields.data.date),
    };

    if (prevState?.transactionId) {
      const transactionId = prevState.transactionId;
      const oldTransaction = await DB.getTransactionById(
        transactionId,
        session.user.id,
      );

      if (oldTransaction.length !== 1) {
        return {
          success: false,
          message: "Transaction does not exist",
          transactionId,
        };
      }
      if (oldTransaction[0].userId !== session.user.id) {
        return {
          success: false,
          message: "Unauthorised",
          transactionId,
        };
      }

      await DB.updateTransaction(transactionId, transactionData);

      after(async () => {
        await handleBudgetAlert();
      });
      revalidatePath("/dashboard/transactions");

      return {
        success: true,
        message: "Transaction updated successfully!",
        transactionId,
      };
    }

    const createTransactionData = {
      ...transactionData,
      userId: session.user.id,
    };
    await DB.createTransaction(createTransactionData);

    after(async () => {
      await handleBudgetAlert();
    });
    revalidatePath("/dashboard/transactions");

    return {
      success: true,
      message: "Transaction added successfully!",
    };
  } catch (err) {
    const error = err as Error;
    console.error(error?.message);
  }
}

export async function deleteTransaction(transactionId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorised",
      };
    }

    const oldTransaction = await DB.getTransactionById(
      transactionId,
      session.user.id,
    );

    if (oldTransaction.length !== 1) {
      return {
        success: false,
        message: "Transaction does not exist",
      };
    }
    if (oldTransaction[0].userId !== session.user.id) {
      return {
        success: false,
        message: "Unauthorised",
      };
    }

    await DB.deleteTransaction(transactionId);

    revalidatePath("/dashboard");
    return {
      success: true,
      message: "Transaction deleted successfully!",
    };
  } catch (error) {
    console.error("Failed to delete transaction:", error);
    return {
      success: false,
      message: "Failed to delete transaction",
    };
  }
}
