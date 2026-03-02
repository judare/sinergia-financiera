"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/app/hooks/useSession";
import { useApi } from "@/app/hooks/useApi";
import { fetchOnboardingReport } from "@/app/services/onboarding";
import Header from "@/app/components/UI/Header";
import { Loader } from "@/ds";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type ByArea = {
  areaId: number;
  areaName: string;
  total: number;
  avgResponseTimeMinutes: number;
  avgResponseTimeHours: number;
};

type ByAreaStatus = {
  areaId: number;
  areaName: string;
  status: string;
  count: number;
  avgResponseTimeMinutes: number;
  avgResponseTimeHours: number;
};

const COLORS = [
  "#6366f1",
  "#22d3ee",
  "#f59e0b",
  "#10b981",
  "#f43f5e",
  "#a78bfa",
  "#fb923c",
  "#34d399",
];

const STATUS_COLORS: Record<string, string> = {
  Pendiente: "bg-yellow-100 text-yellow-700",
  Completado: "bg-green-100 text-green-700",
  "En proceso": "bg-blue-100 text-blue-700",
};

function formatTime(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export default function Reports() {
  const { data: session } = useSession();
  const { callApi, loading } = useApi(fetchOnboardingReport);
  const [byArea, setByArea] = useState<ByArea[]>([]);
  const [byAreaStatus, setByAreaStatus] = useState<ByAreaStatus[]>([]);

  useEffect(() => {
    if (session) {
      callApi().then((data) => {
        if (data) {
          setByArea(data.byArea ?? []);
          setByAreaStatus(data.byAreaStatus ?? []);
        }
      });
    }
  }, [session]);

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  const chartData = byArea.map((a, i) => ({
    name: a.areaName,
    value: a.avgResponseTimeMinutes,
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      <Header />
      <main className="flex-1 px-20 py-6">
        {/* Encabezado */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-neutral-900">Reportes</h2>
          <p className="text-sm text-neutral-500 mt-1">
            Tiempos de respuesta por área · solicitudes agrupadas por estado
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Gráfica dona */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-neutral-700 mb-4">
                Tiempo medio de respuesta por área (en minutos)
              </h3>

              {chartData.length === 0 ? (
                <p className="text-sm text-neutral-400 text-center py-10">
                  Sin datos disponibles
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={130}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, value }) =>
                        `${name}: ${formatTime(value)}`
                      }
                      labelLine={false}
                    />

                    <Tooltip
                      formatter={(value: number | undefined) => [
                        formatTime(value ?? 0),
                        "Tiempo medio",
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Tabla de detalle */}
            <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-neutral-100">
                <h3 className="text-sm font-semibold text-neutral-700">
                  Detalle por área y estado
                </h3>
              </div>

              {byAreaStatus.length === 0 ? (
                <p className="text-sm text-neutral-400 text-center py-10">
                  Sin datos disponibles
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-100 bg-neutral-50">
                      <th className="text-left px-5 py-3 font-medium text-neutral-600">
                        Área
                      </th>
                      <th className="text-left px-5 py-3 font-medium text-neutral-600">
                        Estado
                      </th>
                      <th className="text-right px-5 py-3 font-medium text-neutral-600">
                        Solicitudes
                      </th>
                      <th className="text-right px-5 py-3 font-medium text-neutral-600">
                        Tiempo medio
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {byAreaStatus.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors"
                      >
                        <td className="px-5 py-3 font-medium text-neutral-900">
                          {row.areaName}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                              STATUS_COLORS[row.status] ??
                              "bg-neutral-100 text-neutral-600"
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right text-neutral-700 tabular-nums">
                          {row.count}
                        </td>
                        <td className="px-5 py-3 text-right text-neutral-700 tabular-nums">
                          {formatTime(row.avgResponseTimeMinutes)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
