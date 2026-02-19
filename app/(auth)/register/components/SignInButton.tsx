"use client";
import { CircleUser } from "lucide-react";

export default function RegisterForm() {
  return (
    <div className="mx-auto">
      <a
        href="/login"
        className="shadow text-neutral-700 px-5 py-3 rounded-xl  hover:bg-neutral-200 flex items-center gap-5  justify-between border border-neutral-400 mt-10 "
      >
        <div>
          <span className="font-bold">¿Ya tienes una cuenta?</span>
          <div className="font-light text-sm">Inicia sesión</div>
        </div>
        <CircleUser className="text-neutral-700 size-8" />
      </a>
    </div>
  );
}
