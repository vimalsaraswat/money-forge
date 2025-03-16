"use server";

import { auth } from "@/auth";
import { DB } from "@/db/queries";
import { transporter } from "@/lib/mail";
import { formatCurrency } from "@/lib/utils";
import fs from "node:fs";
import path from "node:path";
import { getRoast } from "./ai/roast";

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

export async function sendEmail({
  email,
  subject,
  message,
}: {
  email: string;
  subject: string;
  message: string;
}) {
  try {
    // Send email
    await transporter().sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: email,
      subject,
      html: message,
      text: message,
    });

    return { success: true, message: "Email sent successfully!" };
  } catch (error) {
    console.error("Email send error:", error);
    return {
      success: false,
      message: "Failed to send email. Please try again.",
    };
  }
}

export const getEmailTemplate = async (
  templateName: string,
  variables: Record<string, string | number>,
) => {
  const templatePath = path?.resolve(
    process.cwd(),
    "templates",
    `${templateName}.html`,
  );
  let template = fs.readFileSync(templatePath, "utf-8");

  for (const key in variables) {
    const value = variables[key];
    template = template.replace(new RegExp(`{{${key}}}`, "g"), String(value));
  }

  return template;
};
