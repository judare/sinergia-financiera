import { getServerSession } from "@/lib/sessionServer";
import { redirect } from "next/navigation";
import { SessionProvider } from "@/app/providers/Session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
