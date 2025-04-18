import { auth } from "@/auth";
import TransactionForm from "@/components/transaction/transaction-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DB } from "@/db/queries";
import { TransactionType } from "@/types";
import { notFound } from "next/navigation";

export default async function EditTransactionForm({
  params,
}: {
  params: Promise<{ id: string | undefined }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    notFound();
  }

  const transactionId = (await params)?.id;

  const transaction = transactionId
    ? ((await DB.getTransactionById(
        transactionId,
        session.user.id,
      )) as TransactionType[])
    : [];

  if (!transaction?.length) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="text-2xl font-bold">Edit Transaction</h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <TransactionForm transaction={transaction[0]} editMode={true} />
      </CardContent>
    </Card>
  );
}
