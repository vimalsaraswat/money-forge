"use server";

import { auth } from "@/auth";
import { DB } from "@/db/queries";
import { TransactionEnum } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function getUserCategories() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return [];
    }

    return await DB.getCategories(session?.user?.id);
  } catch (err) {
    const error = err as Error;
    console.error("Error fething user categories: ", error?.message);
    return [];
  }
}

const CategorySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(50),
  description: z.string().max(100).optional(),
  type: z.nativeEnum(TransactionEnum),
  image: z.string().optional(),
});

type CategoryActionState = {
  success?: boolean;
  message?: string;
  errors?: {
    name?: string[];
    description?: string[];
    type?: string[];
    general?: string;
  };
};

export async function createCustomCategory(
  prevState: CategoryActionState | null,
  formData: FormData,
): Promise<CategoryActionState> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const validatedFields = CategorySchema.safeParse({
      name: formData.get("name"),
      description: formData.get("description"),
      type: formData.get("type"),
      // image: formData.get('image')
    });

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Invalid fields.",
      };
    }

    await DB.createCategory({
      ...validatedFields.data,
      userId: session.user.id,
      isPublic: false,
    });

    revalidatePath("/profile");
    revalidatePath("/dashboard/transactions/new");
    revalidatePath("/dashboard/budgets/new");

    return { success: true, message: "Category created successfully!" };
  } catch (error) {
    console.error("Failed to create category:", error);
    return { success: false, message: "Failed to create category." };
  }
}

export async function updateCustomCategory(
  categoryId: string,
  prevState: CategoryActionState | null,
  formData: FormData,
): Promise<CategoryActionState> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const validatedFields = CategorySchema.safeParse({
      name: formData.get("name"),
      description: formData.get("description"),
      type: formData.get("type"),
      // image: formData.get('image')
    });

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Invalid fields.",
      };
    }

    const existingCategory = await DB.getCategoryById(categoryId);
    if (
      !existingCategory ||
      existingCategory.length === 0 ||
      existingCategory[0].userId !== session.user.id ||
      existingCategory[0].isPublic
    ) {
      return { success: false, message: "Category not found or unauthorized." };
    }

    await DB.updateCategory(categoryId, {
      ...validatedFields.data,
      userId: session.user.id,
      isPublic: false,
    });

    revalidatePath("/profile");
    revalidatePath("/dashboard/transactions/new");
    revalidatePath("/dashboard/budgets/new");

    return { success: true, message: "Category updated successfully!" };
  } catch (error) {
    console.error("Failed to update category:", error);
    return { success: false, message: "Failed to update category." };
  }
}

export async function deleteCustomCategory(
  categoryId: string,
): Promise<CategoryActionState> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const existingCategory = await DB.getCategoryById(categoryId);
    if (
      !existingCategory ||
      existingCategory.length === 0 ||
      existingCategory[0].userId !== session.user.id ||
      existingCategory[0].isPublic
    ) {
      return { success: false, message: "Category not found or unauthorized." };
    }

    const transactionCount = await DB.getTransactionCount(categoryId);

    const budgetCount = await DB.getBudgetCount(categoryId);

    if (
      (transactionCount?.[0]?.count ?? 0) > 0 ||
      (budgetCount?.[0]?.count ?? 0) > 0
    ) {
      return {
        success: false,
        message:
          "Cannot delete category. It is currently used in transactions or budgets.",
        errors: {
          general:
            "Cannot delete category. It is currently used in transactions or budgets.",
        },
      };
    }
    // End of check

    await DB.deleteCategory(categoryId); // Soft delete

    revalidatePath("/profile");
    revalidatePath("/dashboard/transactions/new");
    revalidatePath("/dashboard/budgets/new");

    return { success: true, message: "Category deleted successfully!" };
  } catch (error) {
    console.error("Failed to delete category:", error);
    return { success: false, message: "Failed to delete category." };
  }
}
