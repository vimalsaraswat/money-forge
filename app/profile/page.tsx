import { SignOut } from "@/components/auth";
import { auth } from "@/auth";
import Image from "next/image";

export default async function Profile() {
  const session = await auth();

  return (
    <div className="container h-full mx-auto p-4 flex flex-col">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-6">User Profile</h1>
        <SignOut variant="destructive" />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="relative size-32 md:size-40 rounded-full overflow-hidden">
          {session?.user?.image && (
            <Image
              height={200}
              width={200}
              src={session?.user?.image}
              alt="Profile Picture"
              className="object-cover w-full h-full"
            />
          )}
          {/* <div className="absolute inset-0 bg-black opacity-0 hover:opacity-60 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-white text-sm">Change</span>
          </div> */}
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-semibold">{session?.user?.name}</h2>
          <p className="text-card-foreground">{session?.user?.email}</p>
        </div>
        <div className="flex gap-4">
          {/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Edit Profile
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Settings
          </button> */}
        </div>
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
