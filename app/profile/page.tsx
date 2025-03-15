import { auth } from "@/auth";
import { SignOut } from "@/components/auth";
import { Button } from "@/components/ui/button";
import UserForm from "@/components/user-form";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Profile({
  searchParams,
}: {
  searchParams: Promise<{ edit: boolean | undefined }>;
}) {
  const session = await auth();
  const editMode = !!(await searchParams)?.edit;

  if (!session?.user?.id) {
    notFound();
  }

  const user = session?.user;

  return (
    <div className="container h-full mx-auto p-4 flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          User Profile
        </h1>
        <div className="flex items-center gap-2">
          {!editMode && (
            <Button asChild variant="outline">
              <Link href="/profile?edit=true">
                <Pencil /> Edit
              </Link>
            </Button>
          )}
          <SignOut variant="destructive" />
        </div>
      </div>
      <UserForm
        editMode={editMode}
        user={{
          name: user?.name ?? "",
          image: user?.image ?? "",
          email: user?.email ?? "",
        }}
      />
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
