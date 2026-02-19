"use client";
import { useState, useEffect } from "react";
import DS from "design-system";
import { useApi } from "@/app/hooks/useApi";
import { updateBusiness } from "@/app/services/users";
import { Save } from "lucide-react";
import Card from "./Card";
import FloatBox from "@/app/components/UI/FloatBox";
import { Context } from "@/app/providers/Session";
import { useContext, useContextSelector } from "use-context-selector";

export default function BusinessInfo() {
  const { loading, errors, callApi: callSave } = useApi(updateBusiness);
  const [form, setForm]: any = useState({ hasChanges: false });
  const { business, getBusiness }: any = useContext(Context);
  const showToastConfirm = useContextSelector(
    Context,
    (a) => a.showToastConfirm,
  );

  const handleSave = () => {
    callSave(form)
      .then(() => {
        getBusiness();
        showToastConfirm("Cambios guardados");
        setForm({ ...form, hasChanges: false });
      })
      .catch((e) => {
        showToastConfirm(e?.message, "error");
      });
  };

  const setFormWrapper = (data: any) => {
    setForm({
      ...form,
      ...data,
      hasChanges: true,
    });
  };

  useEffect(() => {
    setForm({
      ...business,
      hasChanges: false,
    });
  }, [business]);

  return (
    <>
      <FloatBox showing={form.hasChanges}>
        <div className="py-3 px-3 flex items-center gap-2 justify-between text-neutral-600 font-light">
          <div className="shrink-0">Cambios sin guardar</div>

          <DS.Button
            onClick={() => handleSave()}
            loading={loading}
            text="Guardar"
            variant="primary"
            size="md"
            icon={Save}
          />
        </div>
      </FloatBox>

      <Card
        title="Contexto de la empresa"
        subtitle="Ayuda a la IA a entender tu empresa"
        body={
          <div className="grid grid-cols-1 lg:grid-cols-1 lg:gap-3 gap-3 mt-5">
            <DS.Input
              type="text"
              value={form.name}
              label="Nombre"
              error={errors?.name}
              onChange={(val: string) => {
                setFormWrapper({ ...form, name: val });
              }}
            />

            <DS.Input
              type="text"
              value={form.website}
              error={errors?.website}
              label="Website"
              onChange={(website: string) => {
                setFormWrapper({ ...form, website });
              }}
            />

            <DS.Textarea
              type="text"
              value={form.context}
              error={errors?.context}
              label="Contexto"
              onChange={(context: string) => {
                setFormWrapper({ ...form, context });
              }}
              placeholder="Escribe aquí a que se dedica tu empresa"
            />
          </div>
        }
      />
    </>
  );
}
