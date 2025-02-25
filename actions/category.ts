"use server";

import { auth } from "@/auth";
import { DB } from "@/db/queries";

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
