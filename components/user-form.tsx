"use client";

import { updateUser } from "@/actions/user";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import ImageInput from "@/components/forms/imageInput";
import SubmitButton from "@/components/forms/submit-button";

type UserFormProps = {
  editMode: boolean;
  user: {
    name: string;
    email: string;
    image: string;
  };
};

export default function UserForm({ editMode, user }: UserFormProps) {
  const [name, setName] = useState(user?.name ?? "");
  const [imageUrl, setImageUrl] = useState(user?.image ?? "");
  const router = useRouter();

  const submitAction = async (formData: FormData) => {
    if (!(name?.length > 3) || !(name?.length < 24)) {
      toast.error(
        "Name must be at least 4 characters long and no more than 24 characters",
      );
      return;
    }
    if (!imageUrl) {
      toast.error("Image is required");
      return;
    }

    if (name === user?.name && imageUrl === user?.image) {
      toast.error("No changes made");
      return;
    }

    const response = await updateUser(formData);
    if (!response?.success) {
      toast.error(response?.error ?? "Error updating user");
    }
    toast.success(response?.message);
    router.push("/profile");
  };

  const handleImageChange = (imageUrl: string) => {
    setImageUrl(imageUrl);
  };

  return (
    <form
      action={submitAction}
      className="flex-1 flex flex-col items-center justify-center gap-6"
    >
      <ImageInput
        name="image"
        mode={editMode ? "edit" : "view"}
        imageUrl={imageUrl}
        handleImageURLChange={handleImageChange}
      />
      <div className="text-center">
        <input
          name="name"
          disabled={!editMode}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="text-2xl font-semibold text-gray-900 dark:text-gray-100 text-center outline-none"
        />
        <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
      </div>
      {editMode && (
        <SubmitButton
          label="Update"
          loadingLabel="Updating..."
          variant="secondary"
        />
      )}
    </form>
  );
}
