import { redirect } from "next/navigation";
import LoginForm from "./components/LoginForm";
import { SessionProvider } from "../../providers/Session";
import { getServerSession } from "@/lib/sessionServer";

export default async function Login() {
  const session = await getServerSession();
  if (session) {
    return redirect("/dashboard");
  }

  return (
    <div className="">
      <div className="min-h-screen h-full bg-white">
        <div className="flex items-center justify-center min-h-screen w-full">
          <SessionProvider session={session}>
            <LoginForm />
          </SessionProvider>
        </div>
      </div>
    </div>
  );
}
