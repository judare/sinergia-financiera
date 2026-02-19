"use client";
import { useState } from "react";
import EmailProvider from "./EmailProvider";
import Providers from "./Providers";
import SignInButton from "./SignInButton";

export default function SignUp() {
  const [step, setStep] = useState("providers");
  return (
    <div className="container relative ">
      <div className="lg:w-[32rem] mx-auto shrink-0 my-10  px-5 py-10  rounded-xl">
        <a href="/" className="mb-10 block">
          <img src="/logo.svg" className="h-6 mx-auto" />
        </a>
        <div className="mb-10">
          <h2 className="text-neutral-950  text-center text-2xl font-medium mb-5">
            Crear cuenta en Talkia
          </h2>

          <p className="font-light text-sm text-center text-neutral-700">
            Crea tu cuenta para comenzar a usar Talkia
          </p>
        </div>

        {step === "emailProvider" && <EmailProvider setStep={setStep} />}
        {step === "providers" && <Providers setStep={setStep} />}

        <div className="border-t border-neutral-300  my-6"></div>

        <SignInButton />
      </div>
    </div>
  );
}
