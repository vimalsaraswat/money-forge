"use server";

import { auth } from "@/auth";
import { DB } from "@/db/queries";
import { TransactionEnum } from "@/types";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { z } from "zod";
import { handleBudgetAlert } from "./alert";

const TransactionSchema = z.object({
  amount: z.string().refine(
    (val) => {
      const parsed = parseFloat(val);
      return !isNaN(parsed) && parsed > 0;
    },
    {
      message: "Amount must be a valid number greater than zero.",
    },
  ),
  type: z.nativeEnum(TransactionEnum, {
    errorMap: () => ({ message: "Please select a transaction type." }),
  }),
  categoryId: z.string({
    errorMap: () => ({ message: "Please select a category." }),
  }),
  date: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
    message: "Invalid date format.",
  }),
  description: z
    .string()
    .max(255, {
      message: "Description must be less than 200 characters.",
    })
    .optional(),
});

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
  after(() => {
    handleBudgetAlert();
  });
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

      const updateData = {
        categoryId:
          (transactionData.categoryId || oldTransaction[0].categoryId) ?? "",
        description:
          (transactionData.description || oldTransaction[0].description) ?? "",
        amount: transactionData.amount || oldTransaction[0].amount,
        date: transactionData.date || oldTransaction[0].date,
        type: transactionData.type || oldTransaction[0].type,
      };
      await DB.updateTransaction(transactionId, updateData);

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
