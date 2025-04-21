"use client";

import {
  createCustomCategory,
  deleteCustomCategory,
  getUserCategories,
  updateCustomCategory,
} from "@/actions";
import InputWithLabel from "@/components/forms/InputWithLabel";
import SubmitButton from "@/components/forms/submit-button";
import Spinner from "@/components/spinner";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CategoryType, TransactionEnum } from "@/types";
import { Info, Lock, Pencil, Plus, Trash } from "lucide-react";
import React, { useActionState, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface ManageCategoriesModalProps {
  triggerButton?: React.ReactNode;
}

export function ManageCategoriesModal({
  triggerButton,
}: ManageCategoriesModalProps) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editCategory, setEditCategory] = useState<CategoryType | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null,
  );

  const fetchCategories = async () => {
    setLoading(true);
    getUserCategories()
      .then((cats) => {
        setCategories(cats as CategoryType[]);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load categories.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!open) {
      // Reset state when closing
      setEditCategory(null);
      setShowAddForm(false);
      setShowDeleteConfirm(null);
    }
  }, [open]);

  const handleModalOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const openAddForm = () => {
    setEditCategory(null);
    setShowAddForm(true);
  };

  const openEditForm = (category: CategoryType) => {
    setShowAddForm(false);
    setEditCategory(category);
  };

  const openDeleteConfirm = (categoryId: string) => {
    setShowDeleteConfirm(categoryId);
  };

  const closeForms = () => {
    setShowAddForm(false);
    setEditCategory(null);
    setShowDeleteConfirm(null);
  };

  const handleSuccess = () => {
    closeForms();
    fetchCategories();
  };

  const expenseCategories = useMemo(
    () => categories.filter((c) => c.type === TransactionEnum.EXPENSE),
    [categories],
  );
  const incomeCategories = useMemo(
    () => categories.filter((c) => c.type === TransactionEnum.INCOME),
    [categories],
  );

  return (
    <Dialog open={open} onOpenChange={handleModalOpenChange}>
      <DialogTrigger asChild>
        {triggerButton || <Button variant="outline">Manage Categories</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-2 py-2">
          {loading ? (
            <Spinner />
          ) : showAddForm || editCategory ? (
            <CategoryForm
              category={editCategory}
              onCancel={closeForms}
              onSuccess={handleSuccess}
            />
          ) : showDeleteConfirm ? (
            <DeleteConfirmation
              categoryId={showDeleteConfirm}
              categoryName={
                categories.find((c) => c.id === showDeleteConfirm)?.name ?? ""
              }
              onCancel={closeForms}
              onSuccess={handleSuccess}
            />
          ) : (
            <Tabs defaultValue="expense" className="w-full">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="expense">Expense</TabsTrigger>
                  <TabsTrigger value="income">Income</TabsTrigger>
                </TabsList>
                <Button size="sm" variant="outline" onClick={openAddForm}>
                  <Plus className="mr-2 h-4 w-4" /> Add New
                </Button>
              </div>
              <TabsContent value="expense">
                <CategoryList
                  categories={expenseCategories}
                  onEdit={openEditForm}
                  onDelete={openDeleteConfirm}
                />
              </TabsContent>
              <TabsContent value="income">
                <CategoryList
                  categories={incomeCategories}
                  onEdit={openEditForm}
                  onDelete={openDeleteConfirm}
                />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CategoryList({
  categories,
  onEdit,
  onDelete,
}: {
  categories: CategoryType[];
  onEdit: (category: CategoryType) => void;
  onDelete: (categoryId: string) => void;
}) {
  if (categories.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-4">
        No categories found.
      </p>
    );
  }
  return (
    <ul className="space-y-2 max-h-96 overflow-y-auto">
      {categories.map((cat) => (
        <li
          key={cat.id}
          className="flex items-center justify-between p-3 border rounded-md bg-card/50 hover:bg-muted/50 transition-colors"
        >
          <div className="flex-1 mr-4 overflow-hidden">
            <p className="font-medium truncate flex items-center">
              {cat.name}
              {cat.isPublic && (
                <span
                  title="Default Category"
                  className="ml-2 text-muted-foreground"
                >
                  <Lock size={14} />
                </span>
              )}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {cat.description}
            </p>
          </div>
          {!cat.isPublic && (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(cat)}
                aria-label={`Edit category ${cat.name}`}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(cat.id)}
                className="text-destructive hover:text-destructive"
                aria-label={`Delete category ${cat.name}`}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

function CategoryForm({
  category,
  onCancel,
  onSuccess,
}: {
  category: CategoryType | null;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const action = category
    ? updateCustomCategory.bind(null, category.id)
    : createCustomCategory;
  const [state, formAction, isPending] = useActionState(action, null);
  const [formType, setFormType] = useState<TransactionEnum>(
    category?.type ?? TransactionEnum.EXPENSE,
  );

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      onSuccess();
    } else if (state?.message && !state.success) {
      toast.error(state.message);
    }
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">
        {category ? "Edit Category" : "Add New Category"}
      </h3>
      <InputWithLabel
        label="Name"
        id="name"
        name="name"
        defaultValue={category?.name ?? ""}
        error={state?.errors?.name?.[0]}
        required
        maxLength={50}
      />
      <InputWithLabel
        variant="textarea"
        label="Description (Optional)"
        id="description"
        name="description"
        defaultValue={category?.description ?? ""}
        error={state?.errors?.description?.[0]}
        maxLength={100}
      />
      <div>
        <Label>Category Type</Label>
        <RadioGroup
          name="type"
          value={formType}
          onValueChange={(value) => setFormType(value as TransactionEnum)}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "hover:bg-background justify-evenly mt-2",
          )}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={TransactionEnum.EXPENSE} id="form-expense" />
            <Label htmlFor="form-expense">Expense</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={TransactionEnum.INCOME} id="form-income" />
            <Label htmlFor="form-income">Income</Label>
          </div>
        </RadioGroup>
        {state?.errors?.type && (
          <p className="text-destructive text-xs text-end mt-1">
            {state.errors.type[0]}
          </p>
        )}
      </div>
      {/* Add Image Input here if needed */}
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <SubmitButton
          label={category ? "Update Category" : "Add Category"}
          loadingLabel={category ? "Updating..." : "Adding..."}
          disabled={isPending}
        />
      </DialogFooter>
    </form>
  );
}

function DeleteConfirmation({
  categoryId,
  categoryName,
  onCancel,
  onSuccess,
}: {
  categoryId: string;
  categoryName: string;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const [state, formAction, isPending] = useActionState(
    deleteCustomCategory.bind(null, categoryId),
    null,
  );

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      onSuccess(); // Close form on success
    } else if (state?.message && !state.success) {
      // Check for the specific error message
      if (state.errors?.general) {
        toast.warning(state.errors.general);
      } else {
        toast.error(state.message);
      }
      if (!state.errors?.general) {
        onCancel();
      }
    }
  }, [state, onSuccess, onCancel]);

  return (
    <form action={formAction} className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">Delete Category</h3>
      <p>
        Are you sure you want to delete the category "
        <strong>{categoryName}</strong>"?
      </p>
      {state?.errors?.general && (
        <Alert variant="destructive">
          <Info className="h-4 w-4" />
          <AlertTitle>Cannot Delete</AlertTitle>
          <AlertDescription>{state.errors.general}</AlertDescription>
        </Alert>
      )}
      <p className="text-sm text-muted-foreground">
        This action cannot be undone.
      </p>
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
        <SubmitButton
          variant="destructive"
          label="Delete Category"
          loadingLabel="Deleting..."
          disabled={isPending || !!state?.errors?.general}
        />
      </DialogFooter>
    </form>
  );
}
