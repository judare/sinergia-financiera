"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "@/app/hooks/useSession";
import { useApi } from "@/app/hooks/useApi";
import { fetchActa } from "@/app/services/onboarding";
import Header from "@/app/components/UI/Header";
import DS, { Loader } from "@/ds";

type TrainingPlan = {
  id: number;
  courseName: string;
  description: string | null;
};

type TechnicalRequirement = {
  id: number;
  computerType: string | null;
  softwareLicenses: string | null;
  clothingSizes: string | null;
};

type Workstation = {
  id: number;
  seatCode: string;
  status: string;
};

type AssetsDelivery = {
  id: number;
  itemName: string;
  serialNumber: string | null;
  isDelivered: boolean;
};

type Acta = {
  id: number;
  processCode: string;
  fullName: string;
  documentType: string;
  documentNumber: string;
  position: string | null;
  area: string | null;
  startDate: string;
  manager: string | null;
  status: string;
  trainingPlans: TrainingPlan[];
  technicalRequirement: TechnicalRequirement | null;
  workstation: Workstation | null;
  assetsDeliveries: AssetsDelivery[];
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-base font-semibold text-neutral-800 border-b border-neutral-200 pb-2 mb-4 print:text-sm">
    {children}
  </h2>
);

const Field = ({ label, value }: { label: string; value?: string | null }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-xs text-neutral-500 uppercase tracking-wide">{label}</span>
    <span className="text-sm text-neutral-900 font-medium">{value || "—"}</span>
  </div>
);

export default function ActaPage() {
  const { data: session } = useSession();
  const params = useParams();
  const id = Number(params.id);
  const { callApi, loading } = useApi(fetchActa);
  const [acta, setActa] = useState<Acta | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (session && id) loadActa();
  }, [session, id]);

  const loadActa = async () => {
    const data = await callApi(id);
    if (data) {
      setActa(data);
    } else {
      setNotFound(true);
    }
  };

  if (!session || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex flex-col min-h-screen bg-neutral-50">
        <Header />
        <div className="flex flex-col items-center justify-center flex-1 gap-3">
          <p className="text-neutral-500 text-sm">
            No se encontró el acta o el proceso no está en estado Finalizado.
          </p>
          <DS.Button
            variant="secondary"
            size="sm"
            text="Volver"
            onClick={() => history.back()}
          />
        </div>
      </div>
    );
  }

  if (!acta) return null;

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          .print-container { box-shadow: none; border: none; }
        }
      `}</style>

      <div className="flex flex-col min-h-screen bg-neutral-50">
        <div className="no-print">
          <Header />
        </div>

        <main className="flex-1 py-10 px-6">
          <div className="max-w-3xl mx-auto">
            {/* Toolbar */}
            <div className="no-print flex justify-between items-center mb-6">
              <div>
                <h1 className="text-xl font-semibold text-neutral-900">
                  Acta de Onboarding
                </h1>
                <p className="text-sm text-neutral-500 mt-0.5">
                  {acta.processCode} — {acta.fullName}
                </p>
              </div>
              <DS.Button
                variant="primary"
                size="md"
                text="Generar documento"
                onClick={() => window.print()}
              />
            </div>

            {/* Acta document */}
            <div className="print-container bg-white border border-neutral-200 rounded-2xl p-10 flex flex-col gap-8">
              {/* Header del documento */}
              <div className="text-center border-b border-neutral-200 pb-6">
                <h1 className="text-2xl font-bold text-neutral-900 print:text-xl">
                  Acta de Onboarding
                </h1>
                <p className="text-sm text-neutral-500 mt-1">
                  Código: {acta.processCode}
                </p>
                <span className="inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                  {acta.status}
                </span>
              </div>

              {/* Información del colaborador */}
              <section>
                <SectionTitle>Información del colaborador</SectionTitle>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Nombre completo" value={acta.fullName} />
                  <Field label="Tipo de documento" value={acta.documentType} />
                  <Field label="Número de documento" value={acta.documentNumber} />
                  <Field label="Cargo" value={acta.position} />
                  <Field label="Área" value={acta.area} />
                  <Field label="Fecha de ingreso" value={acta.startDate} />
                  <Field label="Responsable" value={acta.manager} />
                </div>
              </section>

              {/* Plan de formación */}
              <section>
                <SectionTitle>Plan de formación</SectionTitle>
                {acta.trainingPlans.length === 0 ? (
                  <p className="text-sm text-neutral-400">Sin cursos asignados.</p>
                ) : (
                  <table className="w-full text-sm border border-neutral-200 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-200">
                        <th className="text-left px-4 py-2 font-medium text-neutral-600">
                          Curso
                        </th>
                        <th className="text-left px-4 py-2 font-medium text-neutral-600">
                          Descripción
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {acta.trainingPlans.map((tp) => (
                        <tr
                          key={tp.id}
                          className="border-b border-neutral-100 last:border-0"
                        >
                          <td className="px-4 py-2 font-medium text-neutral-900">
                            {tp.courseName}
                          </td>
                          <td className="px-4 py-2 text-neutral-600">
                            {tp.description || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </section>

              {/* Requerimientos técnicos */}
              <section>
                <SectionTitle>Requerimientos técnicos</SectionTitle>
                {!acta.technicalRequirement ? (
                  <p className="text-sm text-neutral-400">Sin requerimientos registrados.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Field
                      label="Tipo de equipo"
                      value={acta.technicalRequirement.computerType}
                    />
                    <Field
                      label="Tallas de dotación"
                      value={acta.technicalRequirement.clothingSizes}
                    />
                    <div className="col-span-2">
                      <Field
                        label="Licencias de software"
                        value={acta.technicalRequirement.softwareLicenses}
                      />
                    </div>
                  </div>
                )}
              </section>

              {/* Puesto de trabajo */}
              <section>
                <SectionTitle>Puesto de trabajo asignado</SectionTitle>
                {!acta.workstation ? (
                  <p className="text-sm text-neutral-400">Sin puesto asignado.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Código de puesto" value={acta.workstation.seatCode} />
                    <Field label="Estado" value={acta.workstation.status} />
                  </div>
                )}
              </section>

              {/* Entrega de activos */}
              <section>
                <SectionTitle>Entrega de activos</SectionTitle>
                {acta.assetsDeliveries.length === 0 ? (
                  <p className="text-sm text-neutral-400">Sin activos registrados.</p>
                ) : (
                  <table className="w-full text-sm border border-neutral-200 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-200">
                        <th className="text-left px-4 py-2 font-medium text-neutral-600">
                          Ítem
                        </th>
                        <th className="text-left px-4 py-2 font-medium text-neutral-600">
                          Serial
                        </th>
                        <th className="text-left px-4 py-2 font-medium text-neutral-600">
                          Entregado
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {acta.assetsDeliveries.map((asset) => (
                        <tr
                          key={asset.id}
                          className="border-b border-neutral-100 last:border-0"
                        >
                          <td className="px-4 py-2 font-medium text-neutral-900">
                            {asset.itemName}
                          </td>
                          <td className="px-4 py-2 text-neutral-600">
                            {asset.serialNumber || "—"}
                          </td>
                          <td className="px-4 py-2">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                                asset.isDelivered
                                  ? "bg-green-100 text-green-700"
                                  : "bg-neutral-100 text-neutral-500"
                              }`}
                            >
                              {asset.isDelivered ? "Sí" : "No"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </section>

              {/* Firmas */}
              <section className="mt-4">
                <SectionTitle>Firmas</SectionTitle>
                <div className="grid grid-cols-2 gap-12 mt-6">
                  <div className="flex flex-col gap-2 items-center">
                    <div className="w-full border-b border-neutral-400 h-10" />
                    <span className="text-xs text-neutral-500">Colaborador</span>
                    <span className="text-sm font-medium text-neutral-700">
                      {acta.fullName}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 items-center">
                    <div className="w-full border-b border-neutral-400 h-10" />
                    <span className="text-xs text-neutral-500">Responsable</span>
                    <span className="text-sm font-medium text-neutral-700">
                      {acta.manager || "—"}
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
