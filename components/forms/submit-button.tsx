"use client";

import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type SubmitButtonProps = React.ComponentProps<typeof Button> & {
  label?: string;
  loadingLabel?: string;
  loading?: React.ReactNode;
  children?: React.ReactNode;
};

export default function SubmitButton({
  label,
  loadingLabel,
  loading,
  children,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      {...props}
      type="submit"
      disabled={pending}
      className={cn("cursor-pointer", props?.className)}
    >
      {pending && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
      )}
      {pending ? loadingLabel : label}
      {pending ? loading : children}
    </Button>
  );
}
