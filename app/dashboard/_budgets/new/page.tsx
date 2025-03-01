import BudgetForm from "@/components/budget/budget-form";

export default async function AddBudgetForm() {
  return (
    <div className="container mx-auto max-w-2xl p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Budget</h1>
      <BudgetForm />
    </div>
  );
}
