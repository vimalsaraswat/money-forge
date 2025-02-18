import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type transactions as TransactionsType } from "@/db/tables/finance";
import { cn } from "@/lib/utils";
import { TransactionEnum } from "@/types";

export default function TransactionList({
  transactions,
}: {
  transactions: (typeof TransactionsType.$inferSelect)[];
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
        {transactions?.length > 0 ? (
          transactions?.map((transaction) => (
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
              <TableCell>
                {new Date(transaction.date).toLocaleString()}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <td colSpan={4} className="text-center text-muted-foreground py-20">
              No transactions found
            </td>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
