"use client";

import { getUserCategories } from "@/actions/category";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CategoryType } from "@/types";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface CategorySelectProps {
  selectedCategory: string | null;
  type: string;
  name: string;
}

export default function CategorySelect({
  selectedCategory,
  type,
  name,
}: CategorySelectProps) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [category, setCategory] = useState(
    categories?.find((c) => c?.name === selectedCategory)?.id ?? "",
  );

  const categoriesToShow = useMemo(() => {
    return categories?.filter((category) => category.type === type);
  }, [type, categories]);

  useEffect(() => {
    (async () => {
      const userCategories = await getUserCategories();
      setCategories(userCategories as CategoryType[]);
      setCategoriesLoading(false);
    })();
  }, []);

  return (
    <div className="flex gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {category
              ? categories.find((c) => c.id === category)?.name
              : `Select ${type} category...`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[400px] p-0 max-w-[80vw] max-h-[40vh]"
          side="bottom"
          align="center"
        >
          <Command>
            <CommandInput placeholder={`Search ${type} categories...`} />
            <CommandList>
              <CommandEmpty>
                {!type
                  ? "Select a transaction type first."
                  : categoriesLoading
                    ? "Loading categories..."
                    : "No category found."}
                {/* <Button
                  variant="ghost"
                  className="flex items-center w-full mt-2"
                  onClick={() => {
                    setOpen(false);
                    setShowAddCategory(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add custom category
                </Button> */}
              </CommandEmpty>
              <CommandGroup>
                {categoriesToShow?.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.name}
                    onSelect={() => {
                      setCategory(item.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        category === item.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <div className="flex flex-col overflow-hidden">
                      <span className="truncate">{item.name}</span>
                      <span className="text-xs text-muted-foreground line-clamp-2 text-wrap">
                        {item.description}
                      </span>
                    </div>
                    {/* {category.id.startsWith("income-") ||
                    category.id.startsWith("expense-") ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 hover:bg-secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveCategory(category.id);
                        }}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    ) : null} */}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {/* <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => setShowAddCategory(true)}
      >
        <Plus className="h-4 w-4" />
      </Button> */}
      <input
        className="hidden"
        name={name ?? "category"}
        defaultValue={category}
      />
    </div>
  );
}
