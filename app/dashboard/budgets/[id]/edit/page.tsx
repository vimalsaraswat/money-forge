import { auth } from "@/auth";
import BudgetForm from "@/components/budget/budget-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DB } from "@/db/queries";
import { BudgetType } from "@/types";
import { notFound } from "next/navigation";

export default async function EditBudgetForm({
  params,
}: {
  params: Promise<{ id: string | undefined }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    notFound();
  }

  const budgetId = (await params)?.id;

  const budget = budgetId
    ? ((await DB.getBudgetById(budgetId, session.user.id)) as BudgetType[])
    : [];

  if (!budget?.length) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="text-2xl font-bold">Add New Transaction</h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <BudgetForm budget={budget[0]} editMode={true} />
      </CardContent>
    </Card>
  );
}
