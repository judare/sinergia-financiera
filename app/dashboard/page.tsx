"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "@/app/hooks/useSession";
import { useApi } from "@/app/hooks/useApi";
import {
  fetchOnboardingList,
  createApi,
  fetchAreas,
} from "@/app/services/onboarding";
import Header from "@/app/components/UI/Header";
import DS, { Loader } from "@/ds";
import Filters from "@/app/components/Filters";
import { Info } from "lucide-react";

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
  const { callApi: callApiCreate } = useApi(createApi);
  const { callApi: callApiAreas } = useApi(fetchAreas);
  const [onboardingList, setOnboardingList] = useState<OnboardingProcess[]>([]);
  const [areas, setAreas] = useState<any>([]);
  const [filters, setFilters] = useState<any>([]);
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
    if (data) setOnboardingList(data);
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

  const userFilters = [
    {
      type: "text",
      label: "Estado",
      icon: Info,
      name: "status",
      options: [
        {
          label: "Completado",
          value: "Completado",
        },
        {
          label: "En proceso",
          value: "En proceso",
        },
      ],
    },
  ];

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
      <main className="flex-1 px-20 py-6">
        <div className="mb-5 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">Procesos</h2>
            <p className="text-sm text-neutral-500 mt-1">Lista de procesos</p>
          </div>
          <DS.Button
            variant="primary"
            size="lg"
            onClick={handleCreate}
            text="Crear proceso"
          />
        </div>

        <Filters filters={userFilters} size="sm" setFilters={setFilters} />

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader />
          </div>
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
                      <a href={`/dashboard/onboarding/${process.id}`}>
                        {process.processCode}
                      </a>
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

      <DS.Modal
        title="Crear Proceso"
        ref={createRef}
        size="sm"
        position="center"
      >
        <div className="flex flex-col gap-3">
          <DS.Input
            label="Código"
            value={form.processCode}
            onChange={(processCode) => setForm({ ...form, processCode })}
          />
          <DS.Input
            label="Nombre"
            value={form.fullName}
            onChange={(fullName) => setForm({ ...form, fullName })}
          />

          <DS.Input
            label="Fecha de inicio"
            value={form.startDate}
            onChange={(startDate) => setForm({ ...form, startDate })}
            type="date"
          />

          <DS.Select
            label="Área"
            value={form.areaId}
            onChange={(areaId: any) => setForm({ ...form, areaId })}
          >
            {!form.areaId && <option value="">Seleccione</option>}
            {areas.map((area: any) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </DS.Select>

          <DS.Select
            label="Tipo de documento"
            value={form.documentType}
            onChange={(documentType: any) => setForm({ ...form, documentType })}
          >
            {!form.documentType && <option value="">Seleccione</option>}
            {["DNI", "PASAPORTE", "CEDULA"].map((docType: any) => (
              <option key={docType} value={docType}>
                {docType}
              </option>
            ))}
          </DS.Select>

          <DS.Input
            label="Número de documento"
            value={form.documentNumber}
            onChange={(documentNumber) => setForm({ ...form, documentNumber })}
          />

          <DS.Input
            label="Posición"
            value={form.position}
            onChange={(position) => setForm({ ...form, position })}
          />

          <DS.Button
            onClick={handleSubmitCreate}
            text="Crear proceso"
            variant="primary"
            size="lg"
          />
        </div>
      </DS.Modal>
    </div>
  );
}
