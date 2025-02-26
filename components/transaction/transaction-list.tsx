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
import { DeleteTransaction } from "./transaction-form";
import Link from "next/link";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";

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
              className="border rounded-md p-4 mb-4 shadow-sm flex flex-col gap-2"
            >
              <div className="flex justify-between">
                <div>
                  <div className="capitalize text-md font-semibold">
                    {transaction?.category}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-lg font-bold">
                  {formatCurrency(transaction?.amount)}
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <div
                    className={cn(
                      "capitalize font-semibold text-lg",
                      transaction?.type === TransactionEnum.INCOME
                        ? "text-green-500"
                        : "text-destructive",
                    )}
                  >
                    {transaction?.type}
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-2">
                    {transaction?.description}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" asChild>
                    <Link
                      href={`/dashboard/transactions/${transaction?.id}/edit`}
                    >
                      <Pencil />
                    </Link>
                  </Button>
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
                    <Button variant="outline" size="icon" asChild>
                      <Link
                        href={`/dashboard/transactions/${transaction?.id}/edit`}
                      >
                        <Pencil />
                      </Link>
                    </Button>
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
