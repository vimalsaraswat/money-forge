import { Progress } from "@/components/ui/progress";

const budgets = [
  { category: "Groceries", budget: 500, spent: 350 },
  { category: "Entertainment", budget: 200, spent: 150 },
  { category: "Utilities", budget: 300, spent: 280 },
];

export default function BudgetOverview() {
  return (
    <div className="space-y-4 relative">
      <div className="absolute w-full h-full z-20 top-0 left-0 backdrop-blur-[2px] text-center flex-1 grid place-items-center">
        <p className="text-lg text-gray-500 font-bold">Coming Soon...</p>
      </div>
      <div className="animate-pulse">
        {budgets.map((item) => (
          <div key={item.category}>
            <div className="flex justify-between mb-1">
              <span>{item.category}</span>
              <span>
                ${item.spent} / ${item.budget}
              </span>
            </div>
            <Progress value={(item.spent / item.budget) * 100} />
          </div>
        ))}
      </div>
    </div>
  );
}
