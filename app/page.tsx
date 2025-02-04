import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Personal Finance Tracker</h1>
      <p className="text-xl mb-8">Take control of your finances with ease and clarity.</p>
      <div className="space-x-4">
        <Button asChild>
          <Link href="/login">Log In</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/signup">Sign Up</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}

