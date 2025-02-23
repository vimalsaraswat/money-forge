import { Check, ChevronsUpDown, Plus, XCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CategorySelectProps {
  selectedCategory: string | null;
  setSelectedCategory: (categoryId: string) => void;
  categories: { id: string; name: string; description: string }[];
  type: string;
  setShowAddCategory: (show: boolean) => void;
  handleRemoveCategory: (categoryId: string) => void;
}

export default function CategorySelect({
  selectedCategory,
  setSelectedCategory,
  categories,
  type,
  setShowAddCategory,
  handleRemoveCategory,
}: CategorySelectProps) {
  const [open, setOpen] = useState(false);

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
            {selectedCategory
              ? categories.find((category) => category.id === selectedCategory)
                  ?.name
              : `Select ${type} category...`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" side="bottom" align="center">
          <Command>
            <CommandInput placeholder={`Search ${type} categories...`} />
            <CommandList>
              <CommandEmpty>
                No category found.
                <Button
                  variant="ghost"
                  className="flex items-center w-full mt-2"
                  onClick={() => {
                    setOpen(false);
                    setShowAddCategory(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add custom category
                </Button>
              </CommandEmpty>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.name}
                    onSelect={() => {
                      setSelectedCategory(category.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCategory === category.id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    <div className="flex flex-col">
                      <span>{category.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {category.description}
                      </span>
                    </div>
                    {category.id.startsWith("income-") ||
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
                    ) : null}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => setShowAddCategory(true)}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
