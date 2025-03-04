import { AlertCircle, Pencil, Plus } from "lucide-react";
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
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { DeleteBudget } from "./budget-form";
import { BudgetListType } from "@/types";

const calculateProgress = (spent: number, amount: number) => {
  return (spent / amount) * 100;
};

const getProgressColor = (progress: number) => {
  if (progress >= 90) return "bg-destructive";
  if (progress >= 75) return "bg-warning/80";
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
        <div className="text-center flex flex-col gap-2 items-center justify-center h-full py-20 rounded-lg max-w-[80%] mx-auto">
          <AlertCircle className="h-10 w-10 text-secondary-foreground" />
          <h3 className="text-lg font-semibold text-foreground">
            No Budgets Yet
          </h3>
          <p className="text-sm text-secondary-foreground">
            Start tracking your expenses by creating a budget.
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/budgets/new">
              <Plus className="mr-2 h-4 w-4" /> Create Budget
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {budgets?.map((budget) => {
            const progress = calculateProgress(
              budget?.spent ?? 0,
              budget.amount,
            );
            const progressColor = getProgressColor(progress);

            return (
              <Card key={budget.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between">
                    {budget.category}
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/dashboard/budgets/${budget?.id}/edit`}>
                          <Pencil />
                        </Link>
                      </Button>
                      <DeleteBudget budgetId={budget?.id} />
                    </div>
                  </CardTitle>
                  <CardDescription className="flex flex-col lg:flex-row lg:items-center gap-2">
                    <span>
                      {budget.period.charAt(0).toUpperCase() +
                        budget.period.slice(1)}{" "}
                      Budget
                    </span>
                    <span>
                      {budget?.startDate?.toLocaleDateString()} -{" "}
                      {budget?.endDate?.toLocaleDateString()}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span>
                      {formatCurrency(budget?.spent ?? 0)} /{" "}
                      {formatCurrency(budget?.amount ?? 0)}
                    </span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress
                    value={Math.round(progress)}
                    progressClassName={progressColor}
                  />
                  {progress >= 90 && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4 stroke-warning" />
                      <AlertTitle className="text-warning">Warning</AlertTitle>
                      <AlertDescription>
                        {`You've nearly exceeded your budget for ${budget?.category}`}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    Remaining:{" "}
                    {formatCurrency(budget.amount - (budget?.spent ?? 0))}
                  </p>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
