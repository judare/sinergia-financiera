import { getServerSession } from "@/lib/sessionServer";
import { redirect } from "next/navigation";
import SignUp from "./components/Index";
import { SessionProvider } from "../../providers/Session";
import RetroGrid from "@/app/components/magicui/RetroGrid";

export default async function Register() {
  const session = await getServerSession();
  if (session) {
    return redirect("/dashboard");
  }

  return (
    <div className="grid grid-cols-12 ">
      <div className="col-span-12 min-h-screen h-full relative ">
        <RetroGrid />

        <div className="flex items-center justify-center min-h-screen w-full">
          <SessionProvider session={session}>
            <SignUp />
          </SessionProvider>
        </div>
      </div>
    </div>
  );
}
