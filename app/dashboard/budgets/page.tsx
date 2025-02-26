import { auth } from "@/auth";
import BudgetManagement from "@/components/budget/management";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-end justify-between">
          <h2 className="text-2xl font-bold">Budget Overview</h2>
          <Button asChild>
            <Link href="/dashboard/budgets/new">
              <Plus className="mr-2 h-4 w-4" /> Add Budget
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <BudgetManagement budgets={budgets} />
      </CardContent>
    </Card>
  );
}
