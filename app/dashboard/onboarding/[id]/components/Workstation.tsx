"use client";

import { useRef, useState } from "react";
import { useApi } from "@/app/hooks/useApi";
import { updateOnboardingApi } from "@/app/services/onboarding";
import DS from "@/ds";
import ConfirmToast from "@/app/components/UI/ConfirmToast";

export default function Workstation({
  onboardingId,
  initialWorkstation,
}: {
  onboardingId: number;
  initialWorkstation: any;
}) {
  const toastRef = useRef<any>(null);
  const { callApi: save, loading } = useApi(updateOnboardingApi);
  const [seatCode, setSeatCode] = useState<string>(initialWorkstation?.seatCode || "");

  const handleSave = async () => {
    const result = await save({
      id: onboardingId,
      workstation: seatCode ? { seatCode } : null,
    });
    if (result !== undefined) {
      toastRef.current?.show("Puesto de trabajo guardado", "success");
    }
  };

  const handleClear = async () => {
    setSeatCode("");
    const result = await save({ id: onboardingId, workstation: null });
    if (result !== undefined) {
      toastRef.current?.show("Puesto de trabajo liberado", "success");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <ConfirmToast ref={toastRef} />
      {initialWorkstation && (
        <div className="flex items-center gap-3 px-4 py-3 bg-sky-50 border border-sky-200 rounded-lg">
          <span className="text-sm text-sky-700 font-medium">
            Puesto actual: <strong>{initialWorkstation.seatCode}</strong>
          </span>
          <DS.Button
            text="Liberar"
            variant="third"
            size="sm"
            onClick={handleClear}
            className="ml-auto"
          />
        </div>
      )}
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <DS.Input
            label="Código de puesto"
            value={seatCode}
            onChange={(v: string) => setSeatCode(v)}
          />
        </div>
        <DS.Button
          text="Asignar puesto"
          variant="primary"
          size="md"
          loading={loading}
          onClick={handleSave}
        />
      </div>
    </div>
  );
}
