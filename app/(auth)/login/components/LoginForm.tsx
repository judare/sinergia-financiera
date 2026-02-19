"use client";
import { useState, useRef } from "react";
import DS from "design-system";
import { signIn } from "@/app/hooks/useSession";
import { useApi } from "@/app/hooks/useApi";
import { fetchForgotPassword } from "@/app/services/auth";
import { Github, UserCircle } from "lucide-react";
import { useContextSelector } from "use-context-selector";
import { Context } from "@/app/providers/Session";

export default function LoginForm() {
  const w: any = typeof window !== "undefined" ? (window as any) : null;
  const searchParams = new URLSearchParams(w?.location.search);
  const [form, setForm]: any = useState({});
  const modalRecoverPassword: any = useRef(null);
  const showToastConfirm = useContextSelector(
    Context,
    (a) => a.showToastConfirm,
  );
  const {
    loading: loadingForgot,
    errors: errorsForgot,
    callApi: callApiForgot,
  } = useApi(fetchForgotPassword);

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

  const loginThird = (third: string) => {
    callApi(third, { redirect: searchParams.get("redirect") || "/dashboard" });
  };

  const handleForgotPassword = () => {
    callApiForgot(form).then(() => {
      modalRecoverPassword.current.hideModal();
    });
  };

  return (
    <div className="container ">
      <div className="lg:max-w-[28rem] relative z-10 mx-auto flex flex-col gap-5">
        <a href="/" className="block ">
          <img src="/logo.svg" className="h-8 mx-auto " />
        </a>

        <div className="   px-5 ">
          <div className="mt-5 grid grid-cols-1 gap-3">
            {process.env.NEXT_PUBLIC_GOOGLE_LOGIN != "0" && (
              <div
                className="login-button"
                onClick={() => loginThird("google")}
              >
                <img src="/logos/google.svg" className="size-5" />
                <div>Continuar con Google</div>
              </div>
            )}

            {process.env.NEXT_PUBLIC_GITHUB_LOGIN != "0" && (
              <div
                className="login-button"
                onClick={() => loginThird("github")}
              >
                <Github className="text-neutral-600 size-5" />
                <div>Continuar con GitHub</div>
              </div>
            )}
          </div>

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

          <div
            className="text-neutral-600 dark:text-neutral-300 mt-5 font-light text-sm text-center dark:hover:text-white cursor-pointer"
            onClick={() => modalRecoverPassword.current.showModal()}
          >
            ¿Problemas para iniciar sesión?
          </div>

          <a
            href="/register"
            className="shadow text-neutral-700 px-5 py-3 rounded-xl  hover:bg-neutral-200 flex items-center gap-5  justify-between  mt-10 border-glow bg-gradient-to-tr from-white to-blue-100 border border-black/10"
          >
            <div>
              <span className="font-bold">¿No tienes una cuenta? </span>
              <div className="font-light text-sm">Registrarme</div>
            </div>
            <UserCircle className="size-8 text-neutral-700" />
          </a>
        </div>
      </div>

      <DS.Modal
        title="Recuperar contraseña"
        darkMode={true}
        footer={
          <div className="flex items-center gap-5">
            <DS.Button
              text="Cancelar"
              onClick={() => modalRecoverPassword.current.hideModal()}
              variant="secondary"
              className="w-full"
              size="md"
            />
            <DS.Button
              text="Confirmar"
              onClick={() => handleForgotPassword()}
              variant="primary"
              className="w-full"
              size="md"
              loading={loadingForgot}
              disabled={!form.email}
            />
          </div>
        }
        size="sm"
        ref={modalRecoverPassword}
      >
        <DS.Input
          type="email"
          value={form.email}
          label="Email"
          className="mb-3"
          error={errorsForgot?.email}
          onChange={(val: string) => {
            setForm({ ...form, email: val });
          }}
        />
      </DS.Modal>
    </div>
  );
}
