import { z } from "zod";
import { TransactionEnum } from ".";

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
  categoryId: z.string().uuid({
    message: "Please select a category.",
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

const SignInSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export { TransactionSchema, SignInSchema };
