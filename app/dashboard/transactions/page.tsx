import { auth } from "@/auth";
import TransactionList from "@/components/transaction/transaction-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DB } from "@/db/queries";
import { TransactionType } from "@/types";
import { Plus } from "lucide-react";
import { unstable_cache as cache } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";

const getCachedTransactions = cache(
  async (userId: string) => {
    return (await DB.getTransactions(userId)) as TransactionType[];
  },
  [],
  {
    tags: ["transactions"],
    revalidate: 60,
  },
);

export default async function TransactionsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    notFound();
  }

  const transactions = await getCachedTransactions(session.user.id);

  return (
    <Card className="overflow-auto max-h-full relative max-sm:gap-3 max-sm:bg-transparent max-sm:border-none max-sm:p-0 max-sm:rounded-none">
      <CardHeader className="max-sm:px-0">
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
      <CardContent className="flex-1 overflow-auto max-sm:px-0">
        <TransactionList transactions={transactions} />
      </CardContent>
    </Card>
  );
}
