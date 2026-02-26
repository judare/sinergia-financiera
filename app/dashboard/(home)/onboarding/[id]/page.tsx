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
      <main className="flex-1 px-20 py-6">{JSON.stringify(onboarding)}</main>
    </div>
  );
}
