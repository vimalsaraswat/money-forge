"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

type ImageInputProps = React.ComponentProps<"input"> & {
  mode?: "edit" | "view";
  imageUrl?: string | null;
  handleImageURLChange: (url: string) => void;
  wrapperClassName?: string;
  previewClassName?: string;
  preview?: (imageUrl: string) => React.ReactNode;
  children?: React.ReactNode;
};

export default function ImageInput({
  mode = "edit",
  imageUrl,
  handleImageURLChange,
  wrapperClassName,
  previewClassName,
  preview,
  children,
  ...props
}: ImageInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(imageUrl || null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024 * 4) {
        toast.info("Image size should be less than 4MB");
        return;
      }
      const newURL = URL.createObjectURL(file);
      handleImageURLChange(newURL);
      setPreviewUrl(newURL);
    }
  };

  const handleClick = () => {
    if (mode === "edit") inputRef.current?.click();
  };

  return (
    <div
      onClick={handleClick}
      className={`relative size-32 md:size-40 rounded-full overflow-hidden shadow-lg ${wrapperClassName || ""}`}
    >
      {previewUrl ? (
        <Image
          width={200}
          height={200}
          src={previewUrl}
          alt="Profile Picture"
          className={`object-cover w-full h-full rounded-full ${previewClassName || ""}`}
        />
      ) : (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          No Image
        </div>
      )}
      {mode === "edit" && (
        <div className="absolute inset-0 bg-black opacity-0 hover:opacity-60 transition-opacity duration-300 flex items-center justify-center cursor-pointer rounded-full">
          <span className="text-white text-sm font-medium">Change</span>
        </div>
      )}

      <Input
        {...props}
        type="file"
        accept="image/*"
        placeholder="Upload Image"
        className="hidden"
        onChange={handleImageChange}
        ref={inputRef}
      />
    </div>
  );
}
