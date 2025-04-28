# MoneyForge ✨

<!-- [![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-brightgreen?style=flat-square)](https://orm.drizzle.team/) -->

**MoneyForge is an personal finance management application designed to provide users with clarity on their spending habits, help them budget effectively, and offer AI-driven insights to foster better financial decision-making.**

Built with a modern tech stack, it leverages Next.js App Router features like React Server Components (RSC) and Server Actions for performance and developer experience, integrates with Google Gemini via the Vercel AI SDK for conversational finance assistance, and utilizes Drizzle ORM for type-safe database interactions.

<!-- Optional: Add a screenshot or GIF here -->
<!-- ![MoneyForge Dashboard Screenshot](...) -->

## Key Features

*   **💰 Transaction Tracking:** Log income and expenses with categorization.
*   **📊 Dashboard & Visualizations:** Overview of financial health with charts (Recharts).
*   **🎯 Budget Management:** Create and monitor monthly/yearly budgets per category.
*   **🤖 AI Financial Assistant:** Conversational AI (Google Gemini) for financial queries and insights using Vercel AI SDK with RSC streaming and tool use.
*   **🏷️ Category Management:** Utilize default categories or create custom ones.
*   **📧 Smart Budget Alerts:** Receive email notifications (via Nodemailer) when nearing budget limits, including AI-generated playful roasts.
*   **👤 User Profile & Authentication:** Secure user accounts via NextAuth.js (Google provider).
*   **🖼️ Image Uploads:** Cloudinary integration for user profile pictures.
*   **📄 Data Export:** Export transaction and budget data to CSV.
*   **🎨 Modern UI:** Built with Shadcn UI, Tailwind CSS, and Framer Motion for a responsive and aesthetically pleasing interface.

## Tech Stack

*   **Framework:** Next.js 15+ (App Router)
*   **Language:** TypeScript
*   **UI Components:** Shadcn UI
*   **Styling:** Tailwind CSS
*   **Database ORM:** Drizzle ORM
*   **Database:** PostgreSQL (Neon compatible)
*   **Authentication:** NextAuth.js (v5 / Auth.js)
*   **AI:** Vercel AI SDK (`ai/rsc`), Google Gemini (`@ai-sdk/google`)
*   **State Management:** React Server Components, `useActionState`, `getMutableAIState` (Vercel AI SDK)
*   **Validation:** Zod
*   **Charts:** Recharts
*   **Animations:** Framer Motion
*   **Image Storage:** Cloudinary
*   **Email:** Nodemailer
*   **Deployment:** Vercel

## Getting Started

Follow these instructions to set up the project locally for development.

### Prerequisites

*   Node.js (v18 or later recommended)
*   pnpm (recommended), npm, or yarn
*   Git
*   PostgreSQL Database (e.g., local instance, Docker container, or a cloud provider like Neon)
*   Access to Google Cloud Console for OAuth credentials.
*   Cloudinary account for image uploads.
*   SMTP server credentials for sending emails.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/vimalsaraswat/money-forge.git
    cd money-forge
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    # or npm install / yarn install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root directory by copying `.env.example`.

4.  **Database Migrations:**
    Apply the database schema using Drizzle Kit.
    ```bash
    pnpm db:push # or npx drizzle-kit push:pg
    ```

5.  **Run the development server:**
    ```bash
    pnpm dev
    # or npm run dev / yarn dev
    ```

6.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
money-forge/
├── app/                  # Next.js App Router pages and layouts
├── actions/              # Server Actions (business logic, DB interactions)
├── components/           # Reusable UI components (Shadcn UI based)
├── config/               # Project configuration (prompts, constants)
├── db/                   # Database setup (Drizzle ORM)
│   ├── queries/          # Grouped database query functions
│   ├── tables/           # Drizzle schema definitions
│   └── drizzle.ts        # Drizzle client instance
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions, helpers, external service clients
├── providers/            # React Context providers (Theme, AI, Session)
├── public/               # Static assets
├── templates/            # HTML email templates (if applicable)
├── types/                # TypeScript type definitions and Zod schemas
├── .env.local            # Local environment variables (ignored by Git)
├── next.config.mjs       # Next.js configuration
├── drizzle.config.ts     # Drizzle Kit configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Project dependencies and scripts
```

## Architectural Decisions

*   **Next.js App Router:** Chosen for its RSC and Server Actions capabilities, enabling performant server-driven UI and colocated backend logic, improving developer experience and reducing client-side JavaScript.
*   **Server Actions:** Used extensively for form submissions and mutations, simplifying data handling and reducing the need for traditional API routes for CRUD operations.
*   **Drizzle ORM:** Selected for its excellent TypeScript support, type safety, and performance, providing a robust way to interact with the PostgreSQL database. Queries are grouped by domain (`db/queries`) for better organization.
*   **Vercel AI SDK:** Leveraged for seamless integration with LLMs (Google Gemini), providing helpers for streaming UI updates (`streamUI`, `streamText`) and managing AI state (`createAI`, `getMutableAIState`), especially powerful within the RSC paradigm.
*   **Shadcn UI:** Adopted for its composable and customizable UI components, built on Radix UI and Tailwind CSS, allowing for rapid development of a consistent and accessible user interface.
*   **NextAuth.js:** Provides a flexible and secure authentication solution, easily integrated with Next.js and various providers.
*   **Modal Routes:** Utilized Next.js Parallel Intercepted Routes (`@ai`) and standard Dialog components for non-disruptive Add/Edit operations, enhancing user flow.

## Contributing

Contributions are welcome! Please follow these guidelines:

1.  **Fork the repository.**
2.  **Create a new branch:** `git checkout -b feat/your-feature-name` or `fix/your-bug-fix`.
3.  **Make your changes.** Ensure code follows existing style patterns (TypeScript, Prettier).
4.  **Commit your changes:** Use clear and concise commit messages (e.g., `feat: Add budget export functionality`).
5.  **Push to your branch:** `git push origin feat/your-feature-name`.
6.  **Create a Pull Request:** Provide a detailed description of your changes.

---

Happy Forging! Let's build great financial tools.
