"use client";
import { signIn } from "@/app/hooks/useSession";
import { CircleUser, Fingerprint, Github } from "lucide-react";

export default function Providers({ setStep }: { setStep: any }) {
  const w: any = typeof window !== "undefined" ? (window as any) : null;
  const searchParams = new URLSearchParams(w?.location.search);

  const signUpThird = (third: string) => {
    signIn(third, {
      redirect: searchParams.get("redirect") || "/dashboard/onboarding",
    });
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      {process.env.NEXT_PUBLIC_GOOGLE_LOGIN != "0" && (
        <div
          className="login-button "
          onClick={() => {
            signUpThird("google");
          }}
        >
          <Fingerprint className="size-5" />
          <div>Registrarse con Google</div>
        </div>
      )}

      {process.env.NEXT_PUBLIC_GITHUB_LOGIN != "0" && (
        <div
          className="login-button"
          onClick={() => {
            signUpThird("github");
          }}
        >
          <Github className="size-5" />
          <div>Registrarse con Github</div>
        </div>
      )}

      <div
        className="login-button"
        onClick={() => {
          setStep("emailProvider");
        }}
      >
        <CircleUser className="size-5" />

        <div>Registrarme con correo electrónico</div>
      </div>
    </div>
  );
}
