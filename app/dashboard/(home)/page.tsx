"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/app/hooks/useSession";
import { useApi } from "@/app/hooks/useApi";
import { fetchOnboardingList } from "@/app/services/onboarding";
import Header from "@/app/components/UI/Header";
import { Loader, NoItems } from "@/ds";

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
  const { callApi, loading } = useApi(fetchOnboardingList);
  const [onboardingList, setOnboardingList] = useState<OnboardingProcess[]>([]);

  useEffect(() => {
    if (session) {
      loadOnboarding();
    }
  }, [session]);

  const loadOnboarding = async () => {
    const data = await callApi();
    if (data) setOnboardingList(data);
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
      <main className="flex-1 px-6 py-6">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-neutral-900">
            Procesos de Onboarding
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Lista de procesos registrados
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader />
          </div>
        ) : onboardingList.length === 0 ? (
          <NoItems />
        ) : (
          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">
                    Código
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">
                    Nombre
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">
                    Cargo
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">
                    Área
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">
                    Responsable
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">
                    Inicio
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {onboardingList.map((process) => (
                  <tr
                    key={process.id}
                    className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-neutral-500 font-mono text-xs">
                      {process.processCode}
                    </td>
                    <td className="px-4 py-3 font-medium text-neutral-900">
                      {process.fullName}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {process.position}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {process.area || "-"}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {process.manager || "-"}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {process.startDate}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          process.status === "Completado"
                            ? "bg-green-100 text-green-700"
                            : process.status === "En proceso"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {process.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
