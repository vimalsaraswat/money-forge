import { auth } from "@/auth";
import BudgetManagement from "@/components/budget/management";
import { Button } from "@/components/ui/button";
import { DB } from "@/db/queries";
import { BudgetListType } from "@/types";
import { Plus } from "lucide-react";
import { notFound } from "next/navigation";
import { BudgetModal } from "@/components/budget/budget-modal";
import { unstable_cache as cache } from "next/cache";

const getCachedBudgets = cache(
  async (userId: string) => {
    return (await DB.getBudgets(userId)) as BudgetListType;
  },
  ["budgets"],
  {
    tags: ["budgets"],
    revalidate: 10,
  },
);

export default async function BudgetsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    notFound();
  }

  const budgets = await getCachedBudgets(session?.user?.id);

  return (
    <div className="flex flex-col gap-4 relative h-full">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-2xl font-bold">Budget Overview</h2>
        {/* Use BudgetModal for Add button */}
        <BudgetModal
          mode="new"
          trigger={
            <Button variant="outline">
              <Plus className="md:mr-2 h-4 w-4" />
              <span className="sr-only md:not-sr-only">Add Budget</span>
            </Button>
          }
        />
      </div>
      {/* Ensure BudgetManagement takes full height and is scrollable */}
      <div className="flex-1 overflow-y-auto pb-4 flex flex-col">
        <BudgetManagement budgets={budgets} />
      </div>
    </div>
  );
}
