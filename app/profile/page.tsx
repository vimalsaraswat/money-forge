import { auth } from "@/auth";
import { SignOut } from "@/components/auth";
import { Button } from "@/components/ui/button";
import UserForm from "@/components/user-form";
import { Pencil, User, FolderKanban, DatabaseZap } from "lucide-react"; // Added icons
import Link from "next/link";
import { notFound } from "next/navigation";
import { ManageCategoriesModal } from "@/components/settings/manage-categories-modal";
import { DataExport } from "@/components/settings/data-export";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Import Card components

export default async function ProfilePage({
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
    <div className="container h-full mx-auto p-4 grid grid-cols-1 md:grid-cols-1 gap-6 lg:gap-8">
      {" "}
      {/* Use grid/flex for layout */}
      {/* Profile Section Card */}
      <Card className="overflow-hidden">
        {" "}
        {/* Added overflow-hidden */}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-xl font-semibold">
              User Profile
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {!editMode && (
              <Button asChild variant="outline" size="sm">
                <Link href="/profile?edit=true">
                  <Pencil className="mr-1 h-4 w-4" /> Edit
                </Link>
              </Button>
            )}
            <SignOut variant="destructive" size="sm" />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {" "}
          {/* Added padding top */}
          <UserForm
            editMode={editMode}
            user={{
              name: user?.name ?? "",
              image: user?.image ?? "",
              email: user?.email ?? "",
            }}
          />
        </CardContent>
      </Card>
      {/* Data Management Section Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <FolderKanban className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-xl font-semibold">
              Category Management
            </CardTitle>
          </div>
          <CardDescription>
            Organize your financial tracking by managing custom categories.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ManageCategoriesModal
            triggerButton={
              <Button variant="secondary">Manage Categories</Button> // Slightly different variant
            }
          />
          {/* Optional: <p className="text-sm text-muted-foreground"> Add, edit, or delete your custom income and expense categories. </p> */}
        </CardContent>
      </Card>
      {/* Data Export Section Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <DatabaseZap className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-xl font-semibold">Export Data</CardTitle>
          </div>
          <CardDescription>
            Download your transaction and budget data in CSV format.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataExport />
        </CardContent>
      </Card>
      {/* Placeholder for future settings */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>Manage password and security settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Coming soon...</p>
        </CardContent>
      </Card> */}
    </div>
  );
}
