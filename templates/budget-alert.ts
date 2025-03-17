export const budgetAlertHTML = `
  <!doctype html>
  <html lang="en">
      <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Budget Alert</title>
          <style>
              /* General Reset */
              * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
              }
              body {
                  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f9f9f9;
                  color: #333;
                  overflow-x: hidden; /* Prevent horizontal scrolling */
              }
              .container {
                  width: 100%;
                  max-width: 650px;
                  margin: 0 auto;
                  padding: 20px 30px;
                  background-color: #ffffff;
                  border-radius: 8px;
                  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                  border-top: 6px solid #0056b3;
              }

              /* Hero Section */
              h1 {
                  color: #0056b3;
                  text-align: center;
                  margin-bottom: 25px;
                  font-size: 2.5em;
                  font-weight: 600;
                  line-height: 1.2;
              }
              p.hero-text {
                  color: #555;
                  font-size: 1.1em;
                  line-height: 1.6;
                  text-align: center;
                  margin-bottom: 25px;
              }

              /* Budget Section */
              h2 {
                  font-size: 1.3em;
                  margin-top: 20px;
                  margin-bottom: 10px;
                  color: #0056b3;
              }
              p {
                  line-height: 1.6;
                  margin-bottom: 15px;
                  font-size: 1em;
                  color: #555;
              }
              .budget-details {
                  margin-top: 20px;
                  padding: 20px;
                  background-color: #f9f9f9;
                  border: 1px solid #e3e3e3;
                  border-radius: 6px;
              }
              .budget-details p {
                  margin: 8px 0;
              }
              .highlight {
                  font-weight: bold;
                  color: #e74c3c;
              }

              /* Action Items Section */
              .action-items {
                  margin-top: 20px;
                  text-align: center;
              }
              .action-items a {
                  display: inline-block;
                  padding: 12px 25px;
                  background-color: #007bff;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 5px;
                  margin: 10px;
                  transition: background-color 0.3s ease;
              }
              .action-items a:hover {
                  background-color: #0056b3;
              }

              /* Roast Section */
              .roast-section {
                  margin-top: 25px;
                  padding: 20px;
                  background-color: #fff3cd;
                  border: 1px solid #ffeeba;
                  border-radius: 6px;
                  text-align: center;
                  color: #e74c3c;
              }
              .roast-section h2 {
                  font-size: 1.4em;
                  margin-bottom: 15px;
              }
              .roast-section p {
                  font-size: 1.2em;
                  font-style: italic;
              }

              /* Footer Section (Friendly & Sarcastic) */
              footer {
                  margin-top: 40px;
                  text-align: center;
                  color: #555;
                  font-size: 1em;
                  padding: 20px 0;
                  border-top: 2px solid #eaeaea;
                  background-color: #f8f9fa;
              }

              .footer-content {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 0 15px;
              }

              .footer-message {
                  font-size: 1.1em;
                  line-height: 1.6;
                  color: #333;
                  margin-bottom: 10px;
              }

              .footer-signature {
                  font-size: 1.2em;
                  color: #333;
                  font-weight: bold;
                  margin-top: 5px;
              }

              footer p {
                  margin: 5px 0;
              }

              footer strong {
                  color: #0056b3;
              }

              /* Mobile Styles */
              @media only screen and (max-width: 600px) {
                  .container {
                      padding: 15px;
                  }
                  h1 {
                      font-size: 2em;
                  }
                  h2 {
                      font-size: 1.2em;
                  }
                  .action-items a {
                      padding: 10px 20px;
                      font-size: 0.9em;
                  }
                  footer p {
                      font-size: 0.8em;
                  }
              }
          </style>
      </head>
      <body>
          <div class="container">
              <!-- Hero Section (Professional Tone) -->
              <h1>Budget Alert</h1>
              <p class="hero-text">
                  Hello {{username}},<br />
                  This is an important notification about your budget. Please take
                  a moment to review your spending to stay on track.
              </p>

              <!-- Budget Details Section -->
              <h2>Budget Details</h2>
              <div class="budget-details">
                  <p><strong>Category:</strong> {{categoryName}}</p>
                  <p><strong>Budgeted Amount:</strong> {{budgetAmount}}</p>
                  <p><strong>Amount Spent:</strong> {{currentSpending}}</p>
                  <p><strong>Remaining:</strong> {{remainingAmount}}</p>
                  <p class="highlight">
                      <strong>Percentage Used:</strong> {{spentPercentage}}%
                  </p>
              </div>

              <!-- Next Steps Section -->
              <h2>What to Do Next</h2>
              <p>
                  Here are a few things you can do to review your spending and
                  stay on track:
              </p>

              <div class="action-items">
                  <a href="https://money-forge.com/dashboard/budgets"
                      >View Budgets</a
                  >
                  <a href="https://money-forge.com/dashboard/transactions"
                      >Review Transactions</a
                  >
              </div>

              <!-- Roast Section (AI-generated message) -->
              {{roastMessage}}

              <!-- Footer Section (Friendly & Sarcastic) -->
              <footer>
                  <div class="footer-content">
                      <p class="footer-message">
                          Hey {{username}}, just a friendly reminder — we’re
                          always here to help you stay on track. You’re doing
                          great, just keep an eye on that budget!
                      </p>
                      <p class="footer-signature">
                          Yours truly, <br />
                          <strong>Team MoneyForge</strong>
                      </p>
                  </div>
              </footer>
          </div>
      </body>
  </html>

  `;
