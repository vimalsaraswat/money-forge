import { auth } from "@/auth";
import BudgetManagement from "@/components/budget/management";
import { Button } from "@/components/ui/button";
import { DB } from "@/db/queries";
import { Plus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function BudgentsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    notFound();
  }

  const budgets = await DB.getBudgets(session?.user?.id);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-bold">Budget Overview</h2>
        <Button variant="outline" asChild>
          <Link href="/dashboard/budgets/new">
            <Plus className="md:mr-2 h-4 w-4" />
            <span className="sr-only md:not-sr-only">Add Budget</span>
          </Link>
        </Button>
      </div>

      <BudgetManagement budgets={budgets} />
    </div>
  );
}
