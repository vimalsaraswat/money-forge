import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatCurrency } from "@/lib/utils";
import { TransactionType, TransactionEnum } from "@/types";
import TransactionForm, { DeleteTransaction } from "./transaction-form";

export default function TransactionList({
  transactions,
}: {
  transactions: TransactionType[];
}) {
  return (
    <>
      <div className="md:hidden">
        {transactions?.length > 0 ? (
          transactions?.map((transaction) => (
            <div
              key={transaction.id}
              className="border rounded-md p-4 mb-4 shadow-sm"
            >
              <div className="flex justify-between">
                <div className="capitalize text-sm text-muted-foreground">
                  {transaction.category}
                </div>
                <div>{formatCurrency(transaction?.amount)}</div>
              </div>
              <div className="text-sm text-muted-foreground">
                {new Date(transaction.date).toLocaleDateString()}
              </div>
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    "capitalize font-semibold",
                    transaction?.type === TransactionEnum.INCOME
                      ? "text-green-500"
                      : "text-destructive",
                  )}
                >
                  {transaction.type}
                </div>
                <div className="mt-2 flex items-center justify-end space-x-2">
                  <TransactionForm transaction={transaction} editMode={true} />
                  <DeleteTransaction transactionId={transaction?.id} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-10">
            No transactions found
          </div>
        )}
      </div>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.length > 0 ? (
              transactions?.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell
                    className={cn(
                      "capitalize",
                      transaction?.type === TransactionEnum.INCOME
                        ? "text-green-500"
                        : "text-destructive",
                    )}
                  >
                    {transaction.type}
                  </TableCell>
                  <TableCell>{formatCurrency(transaction?.amount)}</TableCell>
                  <TableCell className="capitalize">
                    {transaction.category}
                  </TableCell>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <TransactionForm
                      transaction={transaction}
                      editMode={true}
                    />
                    <DeleteTransaction transactionId={transaction?.id} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <td
                  colSpan={4}
                  className="text-center text-muted-foreground py-20"
                >
                  No transactions found
                </td>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
