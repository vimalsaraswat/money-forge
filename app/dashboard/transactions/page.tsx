import { auth } from "@/auth";
import TransactionList from "@/components/transaction/transaction-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DB } from "@/db/queries";
import { TransactionType } from "@/types";
import { Plus } from "lucide-react";
import Link from "next/link";
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
    <Card className="overflow-auto max-h-full">
      <CardHeader>
        <CardTitle className="flex items-end justify-between">
          <h2 className="text-2xl font-bold">Recent Transactions</h2>
          <Button variant="outline" asChild>
            <Link href="/dashboard/transactions/new">
              <Plus className="md:mr-2 h-4 w-4" />
              <span className="sr-only md:not-sr-only">Add Transaction</span>
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <TransactionList transactions={transactions} />
      </CardContent>
    </Card>
  );
}
