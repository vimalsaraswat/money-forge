import { auth } from "@/auth";
import Chat from "@/components/ai-chat";
import { notFound } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (!session?.user?.id) {
    notFound();
  }

  return (
    <div className="flex flex-col p-2 md:p-4 pb-3 md:pb-5 h-full overflow-auto">
      <Chat />
    </div>
  );
}
