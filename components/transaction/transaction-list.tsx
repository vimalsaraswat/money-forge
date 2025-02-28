import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { TransactionType, TransactionEnum } from "@/types";
import { DeleteTransaction } from "./transaction-form";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowDown, ArrowUp, Pencil } from "lucide-react";

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
              <div className="flex justify-between flex-wrap-reverse">
                <div>
                  <div className="capitalize text-md font-semibold">
                    {transaction?.category}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(transaction?.date)}
                  </div>
                </div>
                <div className="text-lg font-bold">
                  {formatCurrency(transaction?.amount)}
                </div>
              </div>
              <div className="flex justify-between flex-wrap">
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
              <TableHead className="text-center">Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="sr-only">Actions</TableHead>
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
                    <div className="flex items-center gap-1">
                      {transaction.type === TransactionEnum.INCOME ? (
                        <ArrowUp />
                      ) : (
                        <ArrowDown />
                      )}{" "}
                      {transaction.type}
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(transaction?.amount)}</TableCell>
                  <TableCell className="capitalize">
                    {transaction?.category}
                  </TableCell>
                  <TableCell>{formatDate(transaction?.date)}</TableCell>
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
