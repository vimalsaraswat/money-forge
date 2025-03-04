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
    ? ((await DB.getBudgetById(budgetId, session.user.id)) as BudgetType[])[0]
    : null;

  if (!budget) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="text-2xl font-bold text-center">Edit Budget</h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 mx-auto max-w-screen-sm w-full">
        <BudgetForm budget={budget} editMode={true} />
      </CardContent>
    </Card>
  );
}
