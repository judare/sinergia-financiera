"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "@/app/hooks/useSession";
import { useApi } from "@/app/hooks/useApi";
import { fetchOnboarding } from "@/app/services/onboarding";
import Header from "@/app/components/UI/Header";
import DS, { Loader } from "@/ds";

type OnboardingProcess = {
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
};

export default function CarnetPage() {
  const { data: session } = useSession();
  const params = useParams();
  const id = Number(params.id);
  const { callApi, loading } = useApi(fetchOnboarding);
  const [onboarding, setOnboarding] = useState<OnboardingProcess | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (session && id) {
      callApi(id).then((data) => {
        if (data && data.status === "finished") {
          setOnboarding(data);
        } else {
          setNotFound(true);
        }
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

  if (notFound) {
    return (
      <div className="flex flex-col min-h-screen bg-neutral-50">
        <Header />
        <div className="flex flex-col items-center justify-center flex-1 gap-3">
          <p className="text-neutral-500 text-sm">
            No se encontró el proceso o aún no está finalizado.
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

  if (!onboarding) return null;

  const initials = onboarding.fullName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
        }
        @page {
          size: 85.6mm 54mm landscape;
          margin: 0;
        }
        @media print {
          .carnet-card {
            width: 85.6mm;
            height: 54mm;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      <div className="flex flex-col min-h-screen bg-neutral-50">
        <div className="no-print">
          <Header />
        </div>

        <main className="flex-1 flex flex-col items-center py-10 px-6">
          <div className="no-print flex justify-between items-center mb-8 w-full max-w-md">
            <div>
              <h1 className="text-xl font-semibold text-neutral-900">
                Carnet del colaborador
              </h1>
              <p className="text-sm text-neutral-500 mt-0.5">
                {onboarding.processCode}
              </p>
            </div>
            <DS.Button
              variant="primary"
              size="md"
              text="Imprimir carnet"
              onClick={() => window.print()}
            />
          </div>

          {/* Carnet */}
          <div
            className="carnet-card w-[340px] h-[214px] rounded-2xl overflow-hidden shadow-xl flex flex-col"
            style={{
              background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
            }}
          >
            {/* Franja superior */}
            <div className="h-2 w-full" style={{ background: "#3b82f6" }} />

            <div className="flex flex-1 px-5 py-4 gap-4">
              {/* Avatar con iniciales */}
              <div className="flex flex-col items-center justify-center gap-2">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white shrink-0"
                  style={{ background: "#3b82f6" }}
                >
                  {initials}
                </div>
                <span className="text-[10px] text-blue-300 font-medium uppercase tracking-wider">
                  Colaborador
                </span>
              </div>

              {/* Divisor */}
              <div className="w-px bg-slate-500 my-1" />

              {/* Datos */}
              <div className="flex flex-col justify-center gap-2 flex-1 min-w-0">
                <div>
                  <p className="text-white font-semibold text-sm leading-tight truncate">
                    {onboarding.fullName}
                  </p>
                  <p className="text-blue-300 text-xs mt-0.5 truncate">
                    {onboarding.position || "—"}
                  </p>
                </div>

                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex gap-1.5 items-center">
                    <span className="text-slate-400 text-[10px] uppercase tracking-wide w-16 shrink-0">
                      Área
                    </span>
                    <span className="text-slate-200 text-[11px] truncate">
                      {onboarding.area || "—"}
                    </span>
                  </div>
                  <div className="flex gap-1.5 items-center">
                    <span className="text-slate-400 text-[10px] uppercase tracking-wide w-16 shrink-0">
                      {onboarding.documentType || "Doc."}
                    </span>
                    <span className="text-slate-200 text-[11px]">
                      {onboarding.documentNumber}
                    </span>
                  </div>
                  <div className="flex gap-1.5 items-center">
                    <span className="text-slate-400 text-[10px] uppercase tracking-wide w-16 shrink-0">
                      Ingreso
                    </span>
                    <span className="text-slate-200 text-[11px]">
                      {onboarding.startDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Franja inferior con código */}
            <div
              className="flex items-center justify-between px-5 py-1.5"
              style={{ background: "#0f172a" }}
            >
              <span className="text-slate-400 text-[9px] uppercase tracking-widest">
                Sinergia
              </span>
              <span className="text-slate-400 text-[9px] font-mono">
                {onboarding.processCode}
              </span>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
