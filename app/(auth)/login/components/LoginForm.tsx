"use client";
import { useState } from "react";
import DS from "design-system";
import { signIn } from "@/app/hooks/useSession";
import { useApi } from "@/app/hooks/useApi";
import { UserCircle } from "lucide-react";
import { useContextSelector } from "use-context-selector";
import { Context } from "@/app/providers/Session";

export default function LoginForm() {
  const w: any = typeof window !== "undefined" ? (window as any) : null;
  const searchParams = new URLSearchParams(w?.location.search);
  const [form, setForm]: any = useState({});
  const showToastConfirm = useContextSelector(
    Context,
    (a) => a.showToastConfirm,
  );

  const { loading, errors, callApi } = useApi(signIn);

  const login = () => {
    callApi("credentials", {
      redirect: searchParams.get("redirect") || "/dashboard",
      email: form.email,
      password: form.password,
    }).catch((e) => {
      showToastConfirm(e?.message, "error");
    });
  };

  return (
    <div className="container ">
      <div className="lg:max-w-[28rem] relative z-10 mx-auto flex flex-col gap-5">
        <a href="/" className="block ">
          <img src="/logo.png" className="h-32 mx-auto " />
        </a>

        <div className="   px-5 ">
          <div className="relative h-10 w-full my-3">
            <div className="absolute top-3 left-0 w-full justify-center flex z-10">
              <div className="bg-white px-3 text-sm text-neutral-400 ">
                Ingresa también con
              </div>
            </div>
            <div className="absolute h-[1px] left-0 top-5 z-0 bg-neutral-300 w-full"></div>
          </div>

          <form action={login} className="flex flex-col gap-5">
            <DS.Input
              type="text"
              name="Email"
              placeholder="Email"
              value={form.email}
              onChange={(val: string) => {
                setForm({ ...form, email: val });
              }}
              error={errors?.email}
            />

            <DS.Input
              type="password"
              // label="Password"
              placeholder="Password"
              value={form.password}
              onChange={(val: string) => {
                setForm({ ...form, password: val });
              }}
              error={errors?.password}
            />

            <DS.Button
              text="Iniciar sesión"
              icon={UserCircle}
              type="submit"
              variant="primary"
              className="w-full"
              size="lg"
              loading={loading}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
