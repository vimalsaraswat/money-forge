"use server";

import { auth } from "@/auth";
import { DB } from "@/db/queries";
import { formatCurrency } from "@/lib/utils";
import { getRoast } from "./ai/roast";
import { budgetAlertHTML } from "@/templates/budget-alert";
import { sendEmail } from "./mail";

export async function handleBudgetAlert() {
  try {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.email || !session?.user?.name) {
      return;
    }

    const budgetData = await DB.getBudgets(session?.user?.id);
    const latestTransaction = (
      await DB.getTransactions(session?.user?.id, 1, "updatedAt")
    )?.[0];
    const matchingBudget = budgetData.find(
      (budget) => budget?.categoryId === latestTransaction?.categoryId,
    );
    if (!matchingBudget) {
      return;
    }

    const spentPercentage =
      (matchingBudget.spent / matchingBudget.amount) * 100;
    if (spentPercentage < 70) {
      return;
    }

    let alertType = "warning";
    if (spentPercentage > 70 && spentPercentage < 90) {
      alertType = "warning";
    }

    if (spentPercentage >= 90) {
      alertType = "critical";
    }

    const roast = await getRoast({
      category: matchingBudget.category!,
      budget: formatCurrency(matchingBudget.amount),
      spending: formatCurrency(matchingBudget.spent),
      name: session.user.name,
    });

    const message = await getEmailTemplate("budget-alert", {
      username: session.user.name,
      categoryName: matchingBudget.category!,
      budgetAmount: formatCurrency(matchingBudget.amount),
      currentSpending: formatCurrency(matchingBudget.spent),
      remainingAmount: formatCurrency(
        matchingBudget.amount - matchingBudget.spent,
      ),
      spentPercentage: spentPercentage.toFixed(0),
      roastMessage: roast?.success
        ? ` <div class="roast-section">
          <p>${roast.message}</p>
      </div>`
        : "",
    });

    await sendEmail({
      email: session?.user?.email,
      subject: `${alertType === "critical" ? "Critical" : ""} Budget Alert for ${session.user.name}`,
      message,
    });

    console.log("Budget alert sent to:", session?.user?.email);
  } catch (error) {
    console.error("Error sending budget alert: ", error);
  }
}

export const getEmailTemplate = async (
  templateName: string,
  variables: Record<string, string | number>,
) => {
  // const templatePath = path?.resolve(
  //   process.cwd(),
  //   "templates",
  //   `${templateName}.html`,
  // );
  // let template = fs.readFileSync(templatePath, "utf-8");
  let template = budgetAlertHTML;

  for (const key in variables) {
    const value = variables[key];
    template = template.replace(new RegExp(`{{${key}}}`, "g"), String(value));
  }

  return template;
};
