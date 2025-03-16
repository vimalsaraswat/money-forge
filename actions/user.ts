"use server";

import { auth } from "@/auth";
import { DB } from "@/db/queries";
import { uploadImage } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

export async function updateUser(formData: FormData) {
  try {
    const image = formData.get("image") as File;
    const name = formData.get("name") as string;

    if (!(name?.length > 4) && !(name?.length < 24)) {
      throw new Error(
        "Name must be at least 4 characters long and no more than 24 characters",
      );
    }

    let imageUrl: string | null = null;
    if (image?.size > 0) {
      imageUrl = await uploadImage(image);
      if (!imageUrl) {
        throw new Error("Image upload failed");
      }
    }

    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    await DB.updateUser(session.user.id, {
      name,
      ...(imageUrl ? { image: imageUrl } : {}),
    });

    revalidatePath("/profile");
    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (err) {
    const error = err as Error;
    return { success: false, error: error?.message ?? "Error updating user" };
  }
}

// https://lh3.googleusercontent.com/a/ACg8ocKsAEWdeYw95TZWaL2P7q1l9vGOyQtiH7E0fdeHTS1_JRerTckj=s96-c
