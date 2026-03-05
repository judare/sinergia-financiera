"use client";

import { useEffect, useRef, useState } from "react";
import { useApi } from "@/app/hooks/useApi";
import { updateOnboardingApi } from "@/app/services/onboarding";
import DS from "@/ds";
import ConfirmToast from "@/app/components/UI/ConfirmToast";

type TechReq = {
  computerType: string;
  softwareLicenses: string;
  clothingSizes: string;
};

export default function TechnicalRequirement({
  onboardingId,
  initialData,
}: {
  onboardingId: number;
  initialData: any;
}) {
  const toastRef = useRef<any>(null);
  const { callApi: save, loading } = useApi(updateOnboardingApi);

  const [form, setForm] = useState<TechReq>({
    computerType: "",
    softwareLicenses: "",
    clothingSizes: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        computerType: initialData.computerType || "",
        softwareLicenses: initialData.softwareLicenses || "",
        clothingSizes: initialData.clothingSizes || "",
      });
    }
  }, [initialData]);

  const set = (field: keyof TechReq) => (v: string) =>
    setForm((f) => ({ ...f, [field]: v }));

  const handleSave = async () => {
    const result = await save({
      id: onboardingId,
      technicalRequirement: {
        computerType: form.computerType || null,
        softwareLicenses: form.softwareLicenses || null,
        clothingSizes: form.clothingSizes || null,
      },
    });
    if (result !== undefined) {
      toastRef.current?.show("Requerimientos técnicos guardados", "success");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <ConfirmToast ref={toastRef} />
      <DS.Input
        label="Tipo de computador"
        value={form.computerType}
        onChange={set("computerType")}
      />
      <DS.Textarea
        label="Licencias de software"
        value={form.softwareLicenses}
        onChange={set("softwareLicenses")}
      />
      <DS.Textarea
        label="Tallas de ropa / dotación"
        value={form.clothingSizes}
        onChange={set("clothingSizes")}
      />
      <DS.Button
        text="Guardar requerimientos técnicos"
        variant="primary"
        size="md"
        loading={loading}
        onClick={handleSave}
      />
    </div>
  );
}
