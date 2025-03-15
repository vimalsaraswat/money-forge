import { auth } from "@/auth";
import Chat from "@/components/ai-chat";
import { Modal } from "@/components/modal";
import { notFound } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (!session?.user?.id) {
    notFound();
  }

  return (
    <Modal>
      <Chat />
    </Modal>
  );
}
