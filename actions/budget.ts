"use server";

import { DB } from "@/db/queries";
import { z } from "zod";
import { PeriodEnum } from "@/types";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

const BudgetSchema = z.object({
  amount: z.coerce
    .number()
    .gt(0, "Amount must be greater than zero")
    .max(1000000, "Amount is too large"),
  categoryId: z.string({
    errorMap: () => ({ message: "Please select a category." }),
  }),
  startDate: z.string().min(1, "Date is required").pipe(z.coerce.date()),
  period: z
    .nativeEnum(PeriodEnum)
    .refine((value) => Object.values(PeriodEnum).includes(value), {
      message: "Invalid period type",
    }),
});

type PrevState =
  | {
      budgetId?: string;
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
      formData,
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
        message: "Missing or invalid fields. Failed to Create Budget.",
      };
    }

    const endDate = (() => {
      const date = new Date(validatedFields?.data?.startDate);
      switch (validatedFields?.data?.period) {
        case PeriodEnum.MONTHLY:
          return new Date(date.setMonth(date.getMonth() + 1));
        case PeriodEnum.YEARLY:
          return new Date(date.setMonth(date.getMonth() + 12));
        default:
          throw new Error("Invalid period");
      }
    })();

    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorised",
      };
    }

    if (prevState?.budgetId) {
      const budgetId = prevState.budgetId;
      const oldBudget = await DB.getBudgetById(budgetId, session.user.id);

      if (oldBudget.length !== 1) {
        return {
          success: false,
          message: "Budget does not exist",
          budgetId,
        };
      }

      if (oldBudget[0].userId !== session.user.id) {
        return {
          success: false,
          message: "Unauthorised",
          budgetId,
        };
      }

      await DB.updateBudget(budgetId, {
        ...validatedFields.data,
        endDate,
        userId: session.user.id,
      });

      revalidatePath("/dashboard/budgets");
      return {
        success: true,
        message: "Budget updated successfully!",
      };
    }

    DB.createBudget({
      ...validatedFields.data,
      endDate,
      userId: session.user.id,
    });

    revalidatePath("/dashboard/budgets");

    return {
      success: true,
      message: "Budget created successfully!",
    };
  } catch (err) {
    const error = err as Error;
    console.error(error?.message || "Failed to create budget.");
    return { message: "Failed to create budget." };
  }
}

export async function deleteBudget(budgetId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorised",
      };
    }

    const oldBudget = await DB.getBudgetById(budgetId, session.user.id);

    if (oldBudget.length !== 1) {
      return {
        success: false,
        message: "Budget does not exist",
      };
    }
    if (oldBudget[0].userId !== session.user.id) {
      return {
        success: false,
        message: "Unauthorised",
        initialValues: {
          id: budgetId,
        },
      };
    }

    await DB.deleteBudget(budgetId);

    revalidatePath("/dashboard/budgets");
    return {
      success: true,
      message: "Budget deleted successfully!",
    };
  } catch (error) {
    console.error("Failed to delete budget:", error);
    return {
      success: false,
      message: "Failed to delete budget",
    };
  }
}
