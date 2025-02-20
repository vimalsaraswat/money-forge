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
                <TransactionForm transaction={transaction} editMode={true} />
                <DeleteTransaction transactionId={transaction?.id} />
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
