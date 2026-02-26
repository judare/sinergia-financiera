import { Context } from "@/app/providers/Session";
import { useContext } from "use-context-selector";
import { fetchSignIn } from "@/app/services/auth";

export function useSession() {
  const { session }: any = useContext(Context);

  return {
    data: session,
  };
}

export const signIn = async (service: string, data: any) => {
  return await fetchSignIn(service, data);
};
