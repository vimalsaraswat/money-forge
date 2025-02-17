import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { transactions as transactionsType } from "@/db/schema";
import { cn } from "@/lib/utils";
import { TransactionEnum } from "@/types";

export default function TransactionList({
  transactions,
}: {
  transactions: (typeof transactionsType.$inferSelect)[];
}) {
  return (
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
        {transactions?.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell
              className={cn(
                "capitalize",
                transaction?.type === TransactionEnum.INCOME
                  ? "text-green-500"
                  : "text-red-500",
              )}
            >
              {transaction.type}
            </TableCell>
            <TableCell>${transaction.amount}</TableCell>
            <TableCell>{transaction.category}</TableCell>
            <TableCell>{new Date(transaction.date).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
