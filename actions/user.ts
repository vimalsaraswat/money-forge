"use server";

import { auth } from "@/auth";
import { DB } from "@/db/queries";
import { uploadImage } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateUser(formData: FormData) {
  try {
    const image = formData.get("image") as File;
    const name = formData.get("name") as string;

    if (!image) {
      throw new Error("No image provided");
    }
    if (!(name?.length > 3)) {
      throw new Error("No name provided");
    }

    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    const imageUrl = await uploadImage(image);
    if (!imageUrl) {
      throw new Error("Image upload failed");
    }

    await DB.updateUser(session.user.id, { name, image: imageUrl });

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
