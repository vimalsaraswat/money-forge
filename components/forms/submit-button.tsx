"use client";

import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type SubmitButtonProps = React.ComponentProps<typeof Button> & {
  label?: string;
  loadingLabel?: string;
  loading?: React.ReactNode;
  content?: React.ReactNode;
};

export default function SubmitButton({
  label,
  loadingLabel,
  loading,
  content,
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
      {pending ? loadingLabel : label}
      {pending ? loading : content}
    </Button>
  );
}
