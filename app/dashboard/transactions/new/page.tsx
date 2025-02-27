import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TransactionForm from "@/components/transaction/transaction-form";

export default async function AddTransactionForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="text-2xl font-bold"> Add New Transaction</h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <TransactionForm />
      </CardContent>
    </Card>
  );
}
