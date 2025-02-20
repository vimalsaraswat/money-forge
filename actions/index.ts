"use server";

import { auth } from "@/auth";
import { DB } from "@/db/queries";
import { CategoryEnum, TransactionEnum } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const TransactionSchema = z.object({
  amount: z.string().refine(
    (val) => {
      const parsed = parseFloat(val);
      return !isNaN(parsed) && parsed > 0;
    },
    {
      message: "Amount must be a valid number greater than zero.",
    }
  ),
  type: z.nativeEnum(TransactionEnum, {
    errorMap: () => ({ message: "Please select a transaction type." }),
  }),
  category: z.nativeEnum(CategoryEnum, {
    errorMap: () => ({ message: "Please select a category." }),
  }),
  date: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
    message: "Invalid date format.",
  }),
  description: z
    .string()
    .max(200, {
      message: "Description must be less than 200 characters.",
    })
    .optional(),
});

type PrevState =
  | {
      success?: boolean;
      errors?: {
        amount?: string[];
        type?: string[];
        category?: string[];
        date?: string[];
        description?: string[];
      };
      initialValues?: {
        id?: string;
        amount: string;
        type: string;
        category: string;
        date: string;
        description: string;
      };
      message?: string;
    }
  | undefined
  | null;

export async function handleTransaction(
  prevState: PrevState,
  formData: FormData
) {
  try {
    const { type, amount, category, date, description } = Object.fromEntries(
      formData
    ) as Record<string, string>;

    const initialValues = { type, amount, category, date, description };
    const validatedFields = TransactionSchema.safeParse(initialValues);

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Missing Fields. Failed to add product.",
        initialValues,
      };
    }

    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorised",
        initialValues,
      };
    }

    const transactionData = {
      ...validatedFields.data,
      description: validatedFields.data?.description ?? "",
      amount: parseFloat(validatedFields.data.amount),
      date: new Date(validatedFields.data.date),
    };

    if (prevState?.initialValues?.id) {
      const transactionId = prevState.initialValues.id;
      const oldTransaction = await DB.getTransactionById(transactionId);

      if (oldTransaction.length !== 1) {
        return {
          success: false,
          message: "Transaction does not exist",
          initialValues: prevState.initialValues,
        };
      }
      if (oldTransaction[0].userId !== session.user.id) {
        return {
          success: false,
          message: "Unauthorised",
          initialValues: prevState.initialValues,
        };
      }

      const updateData = {
        ...oldTransaction[0],
        ...transactionData,
      };
      await DB.updateTransaction(transactionId, updateData);

      revalidatePath("/dashboard");
      return {
        success: true,
        message: "Transaction updated successfully!",
      };
    }

    const createTransactionData = {
      ...transactionData,
      userId: session.user.id,
    };
    await DB.createTransaction(createTransactionData);

    revalidatePath("/dashboard");
    return {
      success: true,
      message: "Transaction added successfully!",
    };
  } catch (err) {
    const error = err as Error;
    console.error(error?.message);
  }
}
