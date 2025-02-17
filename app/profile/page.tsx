// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { SignOut } from "@/components/auth";

export default function Profile() {
  // const [name, setName] = useState("John Doe")
  // const [email, setEmail] = useState("john@example.com")

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault()
  //   // Here you would typically update the user's profile
  //   console.log("Profile updated", { name, email })
  // }

  return (
    <div className="container h-full mx-auto p-4 flex flex-col">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-6">User Profile</h1>
        <SignOut variant="destructive" />
      </div>

      <div className="text-center flex-1 grid place-items-center">
        <p className="text-lg text-gray-500 animate-pulse">Coming Soon...</p>
      </div>
      {/* <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button type="submit">Update Profile</Button>
          </form>
        </CardContent>
      </Card> */}
    </div>
  );
}
