import { AlertCircle, Pencil } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "../ui/button";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { DeleteBudget } from "./budget-form";
import { BudgetListType } from "@/types";
import Image from "next/image";
import { BudgetModal } from "./budget-modal";
import EmptyStateCard from "../EmptyDataCard";

const calculateProgress = (spent: number, amount: number) => {
  if (amount <= 0) return 0;
  return Math.min(100, (spent / amount) * 100);
};

const getProgressColor = (progress: number) => {
  if (progress >= 90) return "bg-destructive";
  if (progress >= 75) return "bg-yellow-500";
  return "bg-primary";
};

export default function BudgetManagement({
  budgets,
}: {
  budgets: BudgetListType;
}) {
  return (
    <div className="space-y-6 flex-1">
      {!(budgets?.length > 0) ? (
        <EmptyStateCard
          heading="No Budgets Yet"
          description="Start tracking your expenses by creating a budget."
          href="/dashboard/budgets/new"
          addText="Create Budget"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {budgets?.map((budget) => {
            const progress = calculateProgress(
              budget?.spent ?? 0,
              budget.amount,
            );
            const progressColor = getProgressColor(progress);
            const remaining = budget.amount - (budget?.spent ?? 0);

            return (
              <Card key={budget.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-3">
                      {budget?.image && (
                        <Image
                          src={budget.image}
                          alt={budget.category || ""}
                          width={36}
                          height={36}
                          className="rounded-md"
                        />
                      )}
                      <CardTitle className="text-lg leading-tight">
                        {budget.category}
                      </CardTitle>{" "}
                    </div>
                    <div className="flex items-center gap-1">
                      {/* Use BudgetModal for Edit */}
                      <BudgetModal
                        mode="edit"
                        budget={budget}
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-accent"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <DeleteBudget budgetId={budget.id} />
                    </div>
                  </div>
                  <CardDescription className="text-xs">
                    {/* Smaller description */}
                    <span>
                      {budget.period.charAt(0).toUpperCase() +
                        budget.period.slice(1)}{" "}
                      Budget |{" "}
                      {formatDate(budget.startDate, {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      -{" "}
                      {formatDate(budget.endDate, {
                        month: "short",
                        day: "numeric",
                        year: "2-digit",
                      })}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 pt-0 pb-3 flex-grow">
                  {/* Adjust padding, add flex-grow */}
                  <div className="text-xs text-muted-foreground flex justify-between">
                    <span>Spent</span>
                    <span>Budget</span>
                  </div>
                  <div className="text-sm font-medium flex justify-between">
                    <span>{formatCurrency(budget.spent ?? 0)}</span>
                    <span>{formatCurrency(budget.amount)}</span>
                  </div>
                  <Progress
                    value={progress}
                    progressClassName={progressColor}
                    className="h-1.5" // Make progress bar thinner
                  />
                  {progress >= 90 && (
                    <Alert
                      variant="destructive"
                      className="mt-2 px-3 py-1.5 text-xs"
                    >
                      {/* Smaller alert */}
                      <AlertCircle className="h-3.5 w-3.5" />
                      <AlertTitle className="font-medium">Warning</AlertTitle>
                      <AlertDescription className="sr-only">
                        {/* Hide description or make it concise */}
                        {`Nearly exceeded budget for ${budget.category}`}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
                <CardFooter className="pt-0 pb-3 px-6 text-xs text-muted-foreground mt-auto">
                  {/* Adjust padding, add mt-auto */}
                  Remaining:{" "}
                  <span
                    className={cn(
                      "font-medium ml-1",
                      remaining < 0 ? "text-destructive" : "text-green-600",
                    )}
                  >
                    {formatCurrency(remaining)}
                  </span>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
