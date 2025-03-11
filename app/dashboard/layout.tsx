import { auth } from "@/auth";
import Image from "next/image";

const imageSrcs = ["/401.gif", "/402.gif", "/405.gif", "/403.gif"];

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
  const imageSrc = imageSrcs[Math.floor(Math.random() * imageSrcs.length)];

  return (
    <div className="h-full w- full flex items-center justify-center">
      {/* <video
        autoPlay
        loop
        muted
        playsInline
        className="h-full object-cover aspect-[9/16]"
      >
        <source src="/401.gif" type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}

      <Image
        src={imageSrc}
        height={600}
        width={600}
        className="rounded-md"
        alt="Billi"
      />
    </div>
  );
}
