import { getServerSession } from "@/lib/sessionServer";
import ForgotForm from "./components/ForgotForm";
import Providers from "@/app/providers/Providers";

export default async function Forgot(props: {
  params: Promise<{ token: string }>;
}) {
  const params = await props.params;
  const session = await getServerSession();
  return (
    <div className="min-h-screen h-full dark:bg-neutral-950 ">
      <div className="flex items-center justify-center min-h-screen w-full">
        <Providers session={session}>
          <ForgotForm token={params.token} />
        </Providers>
      </div>
    </div>
  );
}
