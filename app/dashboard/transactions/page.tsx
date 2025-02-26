import { auth } from "@/auth";
import TransactionList from "@/components/transaction/transaction-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DB } from "@/db/queries";
import { TransactionType } from "@/types";
import { notFound } from "next/navigation";

export default async function TransactionsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    notFound();
  }

  const transactions = (await DB.getTransactions(
    session?.user?.id,
  )) as TransactionType[];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <TransactionList transactions={transactions} />
      </CardContent>
    </Card>
  );
}
