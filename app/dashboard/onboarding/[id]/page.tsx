"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "@/app/hooks/useSession";
import { useApi } from "@/app/hooks/useApi";
import {
  fetchOnboarding,
  createApi,
  fetchAreas,
} from "@/app/services/onboarding";
import Header from "@/app/components/UI/Header";
import DS, { Loader } from "@/ds";
import SelectCourse from "./components/SelectCourse";

type OnboardingProcess = {
  id: number;
  processCode: string;
  fullName: string;
  documentType: string;
  documentNumber: string;
  position: string;
  area: string | null;
  startDate: string;
  manager: string | null;
  status: string;
};

const Section = ({ children, title }: any) => {
  return (
    <div className="flex flex-col gap-3 py-10">
      <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
      {children}
    </div>
  );
};

export default function Home() {
  const { data: session } = useSession();
  const { callApi, loading } = useApi(fetchOnboarding);
  const { callApi: callApiCreate } = useApi(createApi);
  const { callApi: callApiAreas } = useApi(fetchAreas);
  const [onboarding, setOnboarding] = useState<OnboardingProcess | null>(null);
  const [areas, setAreas] = useState<any>([]);
  const createRef = useRef<any>(null);

  const [form, setForm] = useState<any>({});

  useEffect(() => {
    if (session) {
      loadOnboarding();
      loadAreas();
    }
  }, [session]);

  const loadAreas = async () => {
    const data = await callApiAreas();
    if (data) setAreas(data);
  };

  const loadOnboarding = async () => {
    const data = await callApi();
    if (data) setOnboarding(data);
  };

  const handleCreate = function () {
    createRef.current?.showModal();
  };

  const handleSubmitCreate = function () {
    callApiCreate(form).then(() => {
      createRef.current?.hideModal();
      loadOnboarding();
    });
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      <Header />

      <div className="w-1/2 mx-auto flex flex-col divide-y divide-neutral-300 py-10">
        <Section title="Información del proceso">
          <DS.Input label="Código" value={onboarding?.processCode} disabled />
          <DS.Input label="Nombre" value={onboarding?.fullName} disabled />
          <DS.Input label="Posición" value={onboarding?.position} disabled />

          <DS.Input
            label="Tipo de documento"
            value={onboarding?.documentType}
            disabled
          />
          <DS.Input
            label="Número de documento"
            value={onboarding?.documentNumber}
            disabled
          />
        </Section>

        <Section title="Escoger cursos">
          <SelectCourse
            onChange={(checked: any) => {
              setForm({ ...form, courseIds: checked });
            }}
          />
        </Section>
        <Section title="Escoger lugar de trabajo">
          <div
            className="grid grid-cols-8 gap-3  px-10 py-10 items-center justify-center rounded-2xl"
            style={{
              backgroundImage: `url(/piso.jpg)`,
            }}
          >
            {Array.from({ length: 72 }).map((row, i) => (
              <div className="size-10 rounded-lg bg-sky-500 hover:bg-sky-800"></div>
            ))}
          </div>
        </Section>

        <Section>
          <DS.Button
            onClick={handleCreate}
            text="Guardar "
            variant="primary"
            size="lg"
          />
        </Section>
      </div>
    </div>
  );
}
