import { auth } from "@/auth";
import Chat from "@/components/ai-chat";
import { notFound } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (!session?.user?.id) {
    notFound();
  }

  return (
    <div className="flex h-full p-2 md:p-4 pb-3 md:pb-5 self-stretch flex-1 overflow-hidden">
      <Chat />
    </div>
  );
}
