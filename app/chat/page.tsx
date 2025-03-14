import Chat from "@/components/ai-chat";

export default function Page() {
  return (
    <div className="flex flex-col p-2 md:p-4 pb-3 md:pb-5 h-full overflow-auto">
      <Chat />
    </div>
  );
}
