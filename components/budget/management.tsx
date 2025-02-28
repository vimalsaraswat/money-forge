import { AlertCircle, Plus } from "lucide-react";
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

type Budget = {
  id: string;
  category: string | null;
  period: string;
  spent: number;
  amount: number;
};

const calculateProgress = (spent: number, amount: number) => {
  return (spent / amount) * 100;
};

const getProgressColor = (progress: number) => {
  if (progress >= 90) return "bg-destructive";
  if (progress >= 75) return "bg-warning/80";
  return "bg-primary";
};

export default function BudgetManagement({ budgets }: { budgets: Budget[] }) {
  return (
    <div className="space-y-6">
      {!(budgets?.length > 0) ? (
        <div className="grid place-items-center py-20">
          <Button className="mx-auto" variant="ghost" size="lg" asChild>
            <Link href="/dashboard/budgets/new">
              <Plus className="mr-2 h-4 w-4" /> Add Budget
            </Link>
          </Button>

          <p>
            No existing budgets found,
            <br />
            Create one by clicking below
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {budgets?.map((budget) => {
            const progress = calculateProgress(budget.spent, budget.amount);
            const progressColor = getProgressColor(progress);

            return (
              <Card key={budget.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between">
                    {budget.category}
                    <div className="flex items-center gap-2">
                      {/* <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingBudget(budget);
                              setShowEditDialog(true);
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteBudget(budget.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button> */}
                    </div>
                  </CardTitle>
                  <CardDescription>
                    {budget.period.charAt(0).toUpperCase() +
                      budget.period.slice(1)}{" "}
                    Budget
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span>
                      {formatCurrency(budget.spent)} /{" "}
                      {formatCurrency(budget.amount)}
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
                        {`You've nearly exceeded your budget for ${budget.category}`}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    Remaining: {formatCurrency(budget.amount - budget.spent)}
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
