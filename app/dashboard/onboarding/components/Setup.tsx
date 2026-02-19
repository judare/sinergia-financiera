"use client";
import { useState, useEffect } from "react";
import { useContext } from "use-context-selector";
import { useApi } from "@/app/hooks/useApi";
import DS from "design-system";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { updateBusiness } from "@/app/services/users";
import FloatBox from "@/app/components/UI/FloatBox";
import { motion } from "framer-motion";
import { Context } from "@/app/providers/Session";

export default function SetupPage({}: any) {
  const [form, setForm]: any = useState<any>({
    visual: "initial",
  });
  const router = useRouter();
  const { loading, errors, callApi: callSave } = useApi(updateBusiness);
  const { getBusiness, business }: any = useContext(Context);

  useEffect(() => {
    changeBusiness();
  }, [business]);

  const changeBusiness = () => {
    setForm({
      ...form,
      meta: business?.meta ? business.meta : {},
      name: business?.name ? business.name : undefined,
      context: business?.context ? business.context : undefined,
      visual: business?.website ? "companyData" : "initial",
      hasChanges: false,
    });
  };

  const handleSave = () => {
    if (loading) return;
    callSave(form)
      .then(() => getBusiness())
      .then(() => {
        if (form.visual == "companyData") {
          router.push(`/dashboard`);
        }
      });
  };

  const setFormWrapper = (data: any) => {
    setForm({
      ...form,
      ...data,
      hasChanges: true,
    });
  };

  return (
    <>
      <div className="min-h-full lg:flex h-full items-center select-none lg:divide-x divide-neutral-300  ">
        {form.visual == "companyData" && (
          <>
            <div className="py-10  shadow-md  rounded-xl border border-neutral-300 w-full px-5 max-w-[26rem] mx-auto bg-white flex flex-col gap-5 ">
              <DS.Input
                type="text"
                value={form.name}
                label="Nombre de la empresa"
                onChange={(val: string) => {
                  setFormWrapper({ ...form, name: val });
                }}
                error={errors.name}
              />

              <DS.Textarea
                type="text"
                value={form.context}
                label="Contexto de la empresa"
                className="min-h-[200px] max-h-[600px]"
                onChange={(val: string) => {
                  setFormWrapper({ ...form, context: val });
                }}
                error={errors.context}
              />
            </div>

            <div className="py-10 h-full  w-full px-5 max-w-[26rem] mx-auto flex items-center flex-col flex-1 ">
              {form.meta?.suggestedAgents?.length > 0 && (
                <div className="flex flex-col gap-3  my-auto ">
                  <h2 className="font-light text-sm uppercase mb-3">
                    Algunas ideas de agentes
                  </h2>
                  <div className="flex flex-col gap-3">
                    {form.meta.suggestedAgents.map(
                      (agent: string, index: number) => (
                        <motion.div
                          className="flex gap-2 items-center"
                          key={agent}
                          transition={{
                            delay: 0.1 * index,
                            duration: 0.2,
                            ease: [0, 0.71, 0.2, 1.01],
                          }}
                          initial={{ opacity: 0, x: 300 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          <img
                            src={`https://api.dicebear.com/9.x/glass/svg?seed=${
                              index + 10
                            }&background=transparent`}
                            alt=""
                            className="rounded-full size-5"
                          />
                          <div className="font-light text-sm text-neutral-600">
                            {agent}
                          </div>
                        </motion.div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {form.visual == "initial" && (
          <div className="py-10 shadow-md my-10 rounded-xl border border-neutral-300 w-full px-5 max-w-[26rem] mx-auto ">
            <div className="flex flex-wrap gap-3">
              <h2 className="font-light text-sm uppercase mb-3">
                ¿Tu empresa tiene un sitio web?
              </h2>
              <DS.Input
                type="text"
                value={form.website}
                onChange={(val: string) => {
                  setFormWrapper({ ...form, website: val });
                }}
                error={errors.website}
                placeholder="https://tupagina.com"
              />
            </div>

            <div className="mt-5 block font-light text-xs  border-t border-neutral-200  pt-3">
              <div>Esto ayudará a mejorar tu experiencia</div>
            </div>
          </div>
        )}
      </div>
      <FloatBox showing={form.hasChanges || form.visual == "companyData"}>
        <div className="py-3 px-3 flex items-center gap-2 justify-between text-neutral-600 font-light">
          <div className="shrink-0">
            {form.visual == "companyData"
              ? "Terminar registro"
              : "Cambios sin guardar"}
          </div>

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
    </>
  );
}
