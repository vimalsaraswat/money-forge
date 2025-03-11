import { auth } from "@/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const allowedEmails = process.env.ALLOWED_EMAIL?.split(",");

  if (
    (allowedEmails?.length ?? -1) > 0 &&
    session?.user &&
    allowedEmails?.some((email) => email === session?.user?.email)
  )
    return <>{children}</>;

  return (
    <div className="h-full w- full flex items-center justify-center">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="h-full object-cover aspect-[9/16]"
      >
        <source src="/404.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
