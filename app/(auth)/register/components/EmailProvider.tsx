"use client";
import { useState } from "react";
import DS from "design-system";
import { fetchRegister } from "@/app/services/auth";
import { signIn } from "@/app/hooks/useSession";
import { useApi } from "@/app/hooks/useApi";
import { UserCircle } from "lucide-react";

export default function EmailProvider({}: { setStep: any }) {
  const w: any = typeof window !== "undefined" ? (window as any) : null;
  const searchParams = new URLSearchParams(w?.location.search);
  const [form, setForm]: any = useState({
    companySize: "1-5",
  });
  const { loading, errors, callApi } = useApi(fetchRegister);

  const register = () => {
    callApi(form).then(() => {
      setForm({});
      return signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: searchParams.get("redirect") || "/dashboard/onboarding",
      });
    });
  };

  return (
    <form action={register} className="flex flex-col gap-3">
      <DS.Input
        type="text"
        value={form.companyName}
        label="Nombre de la empresa"
        onChange={(companyName: string) => setForm({ ...form, companyName })}
        error={errors?.companyName}
      />

      <DS.Select
        value={form.companySize}
        label="Tamaño de la empresa"
        onChange={(val: string) => {
          setForm({ ...form, companySize: val });
        }}
        error={errors?.companySize}
      >
        <option value="me">Only me</option>
        <option value="1-5">1-5</option>
        <option value="6-20">6-20</option>
        <option value="21-100">21-100</option>
        <option value="101-1000">101-1000</option>
        <option value="1001-infinite">1001-Infinite</option>
      </DS.Select>

      <DS.Input
        type="text"
        value={form.name}
        label="Tu nombre"
        onChange={(val: string) => {
          setForm({ ...form, name: val });
        }}
        error={errors?.name}
      />

      <DS.Input
        type="text"
        value={form.email}
        label="Tu correo electrónico"
        onChange={(val: string) => {
          setForm({ ...form, email: val });
        }}
        error={errors?.email}
      />

      <DS.Input
        type="password"
        value={form.password}
        label="Contraseña"
        onChange={(password: string) => setForm({ ...form, password })}
        error={errors?.password}
      />

      <div className="text-sm text-neutral-500 font-light border-t border-neutral-300  mt-3 pt-3">
        Al usar Talkia, estás de acuerdo con nuestras{" "}
        <a
          href="https://talkia.co/privacy"
          className="underline "
          target="_blank"
        >
          política de privacidad
        </a>{" "}
        y terminos de servicio.
      </div>

      <DS.Button
        text="Registrarse"
        icon={UserCircle}
        type="submit"
        variant="primary"
        className="w-full"
        size="lg"
        loading={loading}
      />
    </form>
  );
}
