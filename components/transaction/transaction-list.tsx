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
import { Button } from "../ui/button";
import { ArrowDown, ArrowUp, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { TransactionModal } from "./transaction-modal";

export default function TransactionList({
  transactions,
}: {
  transactions: TransactionType[];
}) {
  return (
    <>
      {/* --- Mobile View --- */}
      <div className="md:hidden space-y-3">
        {transactions?.length > 0 ? (
          transactions?.map((transaction) => (
            <Card key={transaction.id} className="p-4 shadow-sm">
              <CardHeader className="p-0 flex flex-row items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  {transaction?.image ? (
                    <img
                      src={transaction.image}
                      alt={transaction.category}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        transaction.type === TransactionEnum.INCOME
                          ? "bg-green-500/20 text-green-600"
                          : "bg-red-500/20 text-red-600",
                      )}
                    >
                      {transaction.type === TransactionEnum.INCOME ? (
                        <ArrowUp size={20} />
                      ) : (
                        <ArrowDown size={20} />
                      )}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-md capitalize">
                      {transaction.category}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(transaction.date)}
                    </div>
                  </div>
                </div>
                <span
                  className={cn(
                    "text-lg font-bold",
                    transaction.type === TransactionEnum.INCOME
                      ? "text-green-600"
                      : "text-destructive",
                  )}
                >
                  {formatCurrency(transaction.amount)}
                </span>
              </CardHeader>
              <CardContent className="p-0 flex items-end justify-between">
                <div>
                  {transaction.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {transaction.description}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  {/* Use TransactionModal for Edit */}
                  <TransactionModal
                    mode="edit"
                    transaction={transaction}
                    trigger={
                      <Button variant="outline" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <DeleteTransaction transactionId={transaction.id} />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-10">
            No transactions recorded yet.
          </div>
        )}
      </div>

      {/* --- Desktop View --- */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Type</TableHead>{" "}
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[100px] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.length > 0 ? (
              transactions?.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell
                    className={cn(
                      "font-medium",
                      transaction.type === TransactionEnum.INCOME
                        ? "text-green-600"
                        : "text-destructive",
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      {transaction.type === TransactionEnum.INCOME ? (
                        <ArrowUp size={16} />
                      ) : (
                        <ArrowDown size={16} />
                      )}{" "}
                      <span className="capitalize">{transaction.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">
                    <div className="flex items-center gap-2">
                      {transaction.image && (
                        <img
                          src={transaction.image}
                          alt=""
                          className="w-6 h-6 rounded-sm"
                        />
                      )}
                      {transaction.category}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground">
                    {transaction.description || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      {/* Use TransactionModal for Edit */}
                      <TransactionModal
                        mode="edit"
                        transaction={transaction}
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-accent"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <DeleteTransaction transactionId={transaction.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
