"use server";

import { DB } from "@/db/queries";
import { z } from "zod";
import { PeriodEnum } from "@/types";
import { auth } from "@/auth";

const BudgetSchema = z.object({
  amount: z.coerce
    .number()
    .gt(0, "Amount must be greater than zero")
    .max(1000000, "Amount is too large"),
  categoryId: z.string().min(1, "Category is required"),
  startDate: z.string().min(1, "Date is required").pipe(z.coerce.date()),
  period: z
    .nativeEnum(PeriodEnum)
    .refine((value) => Object.values(PeriodEnum).includes(value), {
      message: "Invalid period type",
    }),
});

type PrevState =
  | {
      success?: boolean;
      message?: string;
      errors?: {
        amount?: string[];
        categoryId?: string[];
        startDate?: string[];
        period?: string[];
      };
    }
  | undefined
  | null;

export async function handleBudget(prevState: PrevState, formData: FormData) {
  try {
    const { categoryId, startDate, period, amount } = Object.fromEntries(
      formData
    ) as Record<string, string>;

    const initialValues = {
      amount,
      categoryId,
      startDate,
      period,
    };
    const validatedFields = BudgetSchema.safeParse(initialValues);

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Missing Fields. Failed to Create Budget.",
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

    DB.createBudget({
      ...validatedFields.data,
      userId: session.user.id,
    });

    return {
      success: true,
      message: "Budget Created",
    };
  } catch (err) {
    const error = err as Error;
    console.error(error?.message);
    return { message: "Failed to create budget." };
  }
}
