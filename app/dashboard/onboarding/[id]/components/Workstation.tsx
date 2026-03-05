"use client";

import { useRef, useState, useEffect } from "react";
import { useApi } from "@/app/hooks/useApi";
import {
  updateOnboardingApi,
  fetchWorkstations,
} from "@/app/services/onboarding";
import DS from "@/ds";
import ConfirmToast from "@/app/components/UI/ConfirmToast";
import { LampDesk } from "lucide-react";

type WorkstationItem = {
  id: number;
  seatCode: string;
  status: "Disponible" | "Ocupado";
  onboardingProcessId: number | null;
};

type ParsedSeat = {
  row: string;
  col: number;
  raw: string;
};

function parseSeatCode(code: string): ParsedSeat {
  const match = code.match(/^([A-Za-z]+)(\d+)$/);
  if (match) {
    return { row: match[1].toUpperCase(), col: parseInt(match[2]), raw: code };
  }
  return { row: code, col: 0, raw: code };
}

function buildOfficeGrid(workstations: WorkstationItem[]) {
  const rowMap: Record<string, WorkstationItem[]> = {};

  for (const ws of workstations) {
    const parsed = parseSeatCode(ws.seatCode);
    if (!rowMap[parsed.row]) rowMap[parsed.row] = [];
    rowMap[parsed.row].push(ws);
  }

  const rows = Object.keys(rowMap).sort();
  for (const row of rows) {
    rowMap[row].sort((a, b) => {
      const pa = parseSeatCode(a.seatCode);
      const pb = parseSeatCode(b.seatCode);
      return pa.col - pb.col;
    });
  }

  return { rows, rowMap };
}

type DeskState = "available" | "occupied" | "mine" | "selected";

function getDeskState(
  ws: WorkstationItem,
  onboardingId: number,
  selectedCode: string | null,
): DeskState {
  if (ws.seatCode === selectedCode) return "selected";
  if (ws.onboardingProcessId === onboardingId) return "mine";
  if (ws.status === "Ocupado") return "occupied";
  return "available";
}

const deskStyles: Record<DeskState, string> = {
  available:
    "bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 hover:border-emerald-400 hover:shadow-md cursor-pointer",
  occupied:
    "bg-rose-50 border-rose-300 text-rose-400 cursor-not-allowed opacity-70",
  mine: "bg-sky-100 border-sky-400 text-sky-800 ring-2 ring-sky-300 cursor-pointer hover:bg-sky-150",
  selected:
    "bg-amber-100 border-amber-400 text-amber-800 ring-2 ring-amber-400 shadow-md cursor-pointer",
};

export default function Workstation({
  onboardingId,
  initialWorkstation,
}: {
  onboardingId: number;
  initialWorkstation: any;
}) {
  const toastRef = useRef<any>(null);
  const { callApi: save, loading: saving } = useApi(updateOnboardingApi);
  const { callApi: loadWorkstations, loading: loadingMap } =
    useApi(fetchWorkstations);

  const [workstations, setWorkstations] = useState<WorkstationItem[]>([]);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [currentCode, setCurrentCode] = useState<string | null>(
    initialWorkstation?.seatCode || null,
  );

  useEffect(() => {
    loadWorkstations(undefined).then((data) => {
      if (data) setWorkstations(data);
    });
  }, []);

  const { rows, rowMap } = buildOfficeGrid(workstations);
  const maxCols = rows.reduce((max, r) => Math.max(max, rowMap[r].length), 0);

  const handleDeskClick = (ws: WorkstationItem) => {
    const state = getDeskState(ws, onboardingId, selectedCode);
    if (state === "occupied") return;
    if (state === "mine" || state === "selected") {
      setSelectedCode(null);
    } else {
      setSelectedCode(ws.seatCode);
    }
  };

  const handleSave = async () => {
    const codeToSave = selectedCode ?? currentCode;
    const result = await save({
      id: onboardingId,
      workstation: codeToSave ? { seatCode: codeToSave } : null,
    });
    if (result !== undefined) {
      setCurrentCode(codeToSave);
      setSelectedCode(null);
      // Refresh map
      const updated = await loadWorkstations(undefined);
      if (updated) setWorkstations(updated);
      toastRef.current?.show("Puesto de trabajo guardado", "success");
    }
  };

  const handleClear = async () => {
    const result = await save({ id: onboardingId, workstation: null });
    if (result !== undefined) {
      setCurrentCode(null);
      setSelectedCode(null);
      const updated = await loadWorkstations(undefined);
      if (updated) setWorkstations(updated);
      toastRef.current?.show("Puesto de trabajo liberado", "success");
    }
  };

  const hasChanges = selectedCode !== null && selectedCode !== currentCode;

  return (
    <div className="flex flex-col gap-5">
      <ConfirmToast ref={toastRef} />

      {/* Status bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-4 text-sm flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-400 inline-block" />
            <span className="text-neutral-600">Disponible</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-rose-400 inline-block" />
            <span className="text-neutral-600">Ocupado</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-sky-400 inline-block" />
            <span className="text-neutral-600">Asignado al proceso</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" />
            <span className="text-neutral-600">Seleccionado</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {currentCode && !hasChanges && (
            <DS.Button
              text="Liberar puesto"
              variant="third"
              size="sm"
              loading={saving}
              onClick={handleClear}
            />
          )}
          {hasChanges && (
            <DS.Button
              text={`Asignar ${selectedCode}`}
              variant="primary"
              size="sm"
              loading={saving}
              onClick={handleSave}
            />
          )}
        </div>
      </div>

      {/* Current assignment badge */}
      {currentCode && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-sky-50 border border-sky-200 rounded-lg text-sm text-sky-700">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
          Puesto asignado: <strong className="ml-1">{currentCode}</strong>
          {selectedCode && selectedCode !== currentCode && (
            <span className="ml-2 text-amber-600">
              → cambiará a <strong>{selectedCode}</strong>
            </span>
          )}
        </div>
      )}

      {/* Office map */}
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 overflow-hidden shadow-sm">
        {/* Office header — windows */}
        <div className="flex items-center justify-between bg-neutral-200 px-6 py-2">
          <div className="flex gap-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-8 h-5 rounded-sm bg-sky-200 border border-sky-300 opacity-80"
              />
            ))}
          </div>
          <span className="text-xs font-medium text-neutral-500 tracking-wide uppercase">
            Planta de oficina
          </span>
          <div className="flex gap-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-8 h-5 rounded-sm bg-sky-200 border border-sky-300 opacity-80"
              />
            ))}
          </div>
        </div>

        {loadingMap ? (
          <div className="flex items-center justify-center py-16 text-neutral-400 text-sm gap-2">
            <svg
              className="animate-spin w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            Cargando mapa de oficina...
          </div>
        ) : workstations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-neutral-400 gap-2">
            <svg
              width="40"
              height="40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            <span className="text-sm">No hay puestos registrados</span>
          </div>
        ) : (
          <div className="p-6 flex flex-col gap-2">
            {rows.map((row) => (
              <div key={row} className="flex flex-col gap-0">
                {/* Row label */}
                <div className="flex items-center gap-0 mb-1">
                  <span className="text-xs font-bold text-neutral-400 w-5 text-center">
                    {row}
                  </span>
                  <div className="flex-1 border-t border-dashed border-neutral-200" />
                </div>

                {/* Desks in row */}
                <div className="flex gap-3 flex-wrap pl-8">
                  {rowMap[row].map((ws) => {
                    const state = getDeskState(ws, onboardingId, selectedCode);
                    return (
                      <button
                        key={ws.id}
                        onClick={() => handleDeskClick(ws)}
                        disabled={state === "occupied"}
                        title={
                          state === "occupied"
                            ? `${ws.seatCode} — Ocupado`
                            : state === "mine"
                              ? `${ws.seatCode} — Asignado (click para deseleccionar)`
                              : state === "selected"
                                ? `${ws.seatCode} — Seleccionado (click para cancelar)`
                                : `${ws.seatCode} — Disponible`
                        }
                        className={`
                          flex flex-col items-center gap-1.5 px-3 py-3 rounded-lg border-2
                          transition-all duration-150 min-w-[72px]
                          ${deskStyles[state]}
                        `}
                      >
                        <LampDesk />
                        <span className="text-xs font-semibold leading-none tracking-wide">
                          {ws.seatCode}
                        </span>
                        {state === "selected" && (
                          <span className="text-[10px] leading-none opacity-70">
                            ✓ elegido
                          </span>
                        )}
                        {state === "mine" && (
                          <span className="text-[10px] leading-none opacity-70">
                            actual
                          </span>
                        )}
                      </button>
                    );
                  })}

                  {/* Empty spacers to fill row */}
                  {Array.from({
                    length: Math.max(0, maxCols - rowMap[row].length),
                  }).map((_, i) => (
                    <div key={`empty-${i}`} className="min-w-[72px]" />
                  ))}
                </div>
              </div>
            ))}

            {/* Office aisle / corridor */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 border-t-2 border-dashed border-neutral-300" />
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-medium px-2">
                Pasillo principal
              </span>
              <div className="flex-1 border-t-2 border-dashed border-neutral-300" />
            </div>
          </div>
        )}

        {/* Office footer — entry */}
        <div className="bg-neutral-200 px-6 py-2 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-6 rounded-t-sm bg-neutral-400 border border-neutral-500 flex items-end justify-center pb-0.5">
              <div className="w-1 h-1 rounded-full bg-neutral-200" />
            </div>
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-medium">
              Entrada
            </span>
            <div className="w-8 h-6 rounded-t-sm bg-neutral-400 border border-neutral-500 flex items-end justify-center pb-0.5">
              <div className="w-1 h-1 rounded-full bg-neutral-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="flex gap-4 text-sm text-neutral-500">
        <span>
          Total:{" "}
          <strong className="text-neutral-700">{workstations.length}</strong>
        </span>
        <span>
          Disponibles:{" "}
          <strong className="text-emerald-600">
            {
              workstations.filter(
                (w) =>
                  w.status === "Disponible" &&
                  w.onboardingProcessId !== onboardingId,
              ).length
            }
          </strong>
        </span>
        <span>
          Ocupados:{" "}
          <strong className="text-rose-500">
            {
              workstations.filter(
                (w) =>
                  w.status === "Ocupado" &&
                  w.onboardingProcessId !== onboardingId,
              ).length
            }
          </strong>
        </span>
      </div>
    </div>
  );
}
