import React from "react";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type BaseInputProps = {
  label: string;
  error?: string;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
  children?: React.ReactNode;
};

type InputProps =
  | (React.ComponentProps<typeof Textarea> &
      BaseInputProps & {
        variant: "textarea";
      })
  | (React.ComponentProps<typeof Calendar> &
      BaseInputProps & {
        variant: "date";
      })
  | (React.ComponentProps<typeof Input> &
      BaseInputProps & {
        variant?: "input";
      });

export default function InputWithLabel({
  id,
  label,
  error,
  className,
  labelClassName,
  errorClassName,
  variant = "input",
  children,
  ...props
}: InputProps) {
  const inputProps = props as React.ComponentProps<typeof Input>;
  const textareaProps = props as React.ComponentProps<typeof Textarea>;
  const dateProps = props as React.ComponentProps<typeof Calendar>;

  return (
    <div className={cn("space-y-2", className)}>
      <Label
        htmlFor={id}
        className={cn(error && "text-destructive", labelClassName)}
      >
        {label}
      </Label>
      {children ? (
        children
      ) : (
        <>
          {variant === "input" && (
            <Input
              id={id}
              {...inputProps}
              className={cn("bg-background", inputProps?.className)}
            />
          )}
          {variant === "textarea" && (
            <Textarea
              id={id}
              {...textareaProps}
              className={cn("bg-background", textareaProps?.className)}
            />
          )}
          {variant === "date" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "pl-3 text-left font-normal w-full",
                    !dateProps?.selected && "text-muted-foreground",
                  )}
                >
                  {dateProps?.selected instanceof Date ? (
                    dateProps.selected.toLocaleDateString()
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar {...dateProps} />
              </PopoverContent>
            </Popover>
          )}
        </>
      )}

      {error && (
        <p
          className={cn(
            "text-[0.8rem] font-medium text-destructive",
            errorClassName,
          )}
        >
          {error}
        </p>
      )}
    </div>
  );
}
