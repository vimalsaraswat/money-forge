import { auth } from "@/auth";
import TransactionList from "@/components/transaction/transaction-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DB } from "@/db/queries";
import { TransactionType } from "@/types";
import { Plus } from "lucide-react";
import { unstable_cache as cache } from "next/cache";
import { notFound } from "next/navigation";
import { TransactionModal } from "@/components/transaction/transaction-modal";

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
    <Card className="overflow-auto max-h-full relative max-sm:gap-3 max-sm:bg-transparent max-sm:border-none max-sm:p-0 max-sm:rounded-none flex flex-col">
      <CardHeader className="max-sm:px-0 sticky top-0 bg-card/80 backdrop-blur-sm z-10">
        <CardTitle className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Recent Transactions</h2>
          <TransactionModal
            mode="new"
            trigger={
              <Button variant="outline">
                <Plus className="md:mr-2 h-4 w-4" />
                <span className="sr-only md:not-sr-only">Add Transaction</span>
              </Button>
            }
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto max-sm:px-0 pt-4">
        <TransactionList transactions={transactions} />
      </CardContent>
    </Card>
  );
}
