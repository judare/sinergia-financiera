"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "@/app/hooks/useSession";
import { useApi } from "@/app/hooks/useApi";
import { fetchOnboarding } from "@/app/services/onboarding";
import Header from "@/app/components/UI/Header";
import DS, { Loader } from "@/ds";
import TrainingPlan from "./components/TrainingPlan";
import Workstation from "./components/Workstation";
import AssetsDelivery from "./components/AssetsDelivery";
import TechnicalRequirement from "./components/TechnicalRequirement";

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
  trainingPlans: any[];
  technicalRequirement: any;
  workstation: any;
  assetsDeliveries: any[];
};

const Section = ({ children, title }: any) => (
  <div className="flex flex-col gap-3 py-10 bg-white rounded-2xl border border-neutral-200 p-5">
    <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
    {children}
  </div>
);

export default function Home() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const { callApi, loading } = useApi(fetchOnboarding);
  const [onboarding, setOnboarding] = useState<OnboardingProcess | null>(null);

  useEffect(() => {
    if (session && id) {
      callApi(Number(id)).then((data) => {
        if (data) setOnboarding(data);
      });
    }
  }, [session, id]);

  if (!session || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      <Header />

      <div className="w-1/2 mx-auto flex flex-col  py-10 gap-10">
        {onboarding?.status === "finished" && (
          <div className="flex justify-end py-4">
            <a href={`/dashboard/onboarding/carnet/${id}`}>
              <DS.Button variant="primary" size="sm" text="Ver carnet" />
            </a>
          </div>
        )}

        <Section title="Información del proceso">
          <DS.Input label="Código" value={onboarding?.processCode} disabled />
          <DS.Input label="Nombre" value={onboarding?.fullName} disabled />
          <DS.Input label="Posición" value={onboarding?.position} disabled />
          <DS.Input label="Área" value={onboarding?.area ?? ""} disabled />
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
          <DS.Input
            label="Fecha de inicio"
            value={onboarding?.startDate}
            disabled
          />
          <DS.Input
            label="Responsable"
            value={onboarding?.manager ?? ""}
            disabled
          />
        </Section>

        <Section title="Plan de capacitación">
          {onboarding && (
            <TrainingPlan
              onboardingId={onboarding.id}
              initialTrainingPlans={onboarding.trainingPlans}
            />
          )}
        </Section>

        <Section title="Puesto de trabajo">
          {onboarding && (
            <Workstation
              onboardingId={onboarding.id}
              initialWorkstation={onboarding.workstation}
            />
          )}
        </Section>

        <Section title="Entrega de activos">
          {onboarding && (
            <AssetsDelivery
              onboardingId={onboarding.id}
              initialAssets={onboarding.assetsDeliveries}
            />
          )}
        </Section>

        <Section title="Requerimientos técnicos">
          {onboarding && (
            <TechnicalRequirement
              onboardingId={onboarding.id}
              initialData={onboarding.technicalRequirement}
            />
          )}
        </Section>
      </div>
    </div>
  );
}
