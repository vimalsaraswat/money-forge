import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Nav() {
  return (
    <nav className="bg-secondary p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Finance Tracker
        </Link>
        <div className="space-x-4">
          <Button asChild variant="ghost">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/profile">Profile</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/logout">Logout</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}

