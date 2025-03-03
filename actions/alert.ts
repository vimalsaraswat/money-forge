"use server";

import { auth } from "@/auth";
import { DB } from "@/db/queries";
import { transporter } from "@/lib/mail";

export async function handleBudgetAlert() {
  try {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.email || !session?.user?.name) {
      return;
    }

    const budgetData = await DB.getBudgets(session?.user?.id);

    const warningMessages: string[] = [];
    const criticalMessages: string[] = [];

    for (const budget of budgetData) {
      const spentPercentage = (budget.spent / budget.amount) * 100;

      if (spentPercentage > 70 && spentPercentage < 90) {
        warningMessages.push(`
            <p>You have spent ${spentPercentage.toFixed(0)}% of your ${budget.category} budget.</p>
            <p>Spent: $${budget.spent}</p>
            <p>Budget: $${budget.amount}</p>
          `);
        console.log(`Warning threshold reached for ${budget.category}`);
      } else if (spentPercentage >= 90) {
        criticalMessages.push(`
            <p>You have spent ${spentPercentage.toFixed(0)}% of your ${budget.category} budget.  Action may be needed!</p>
            <p>Spent: $${budget.spent}</p>
            <p>Budget: $${budget.amount}</p>
          `);
        console.log(`Critical threshold reached for ${budget.category}`);
      }
    }

    const allMessages = [...warningMessages, ...criticalMessages];

    if (allMessages.length > 0) {
      const isCritical = criticalMessages.length > 0;
      const alertType = isCritical ? "Critical Budget Alert" : "Budget Alert";

      await sendEmail({
        email: session?.user?.email,
        subject: `${alertType} for ${session.user.name}`,
        message: `
            <h1>${alertType}</h1>
            ${allMessages.join("<br>")}
          `,
      });

      console.log(`${alertType} email sent for multiple budgets`);
    }
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
