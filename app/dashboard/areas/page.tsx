"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "@/app/hooks/useSession";
import { useApi } from "@/app/hooks/useApi";
import {
  fetchAreas,
  fetchCreateArea,
  fetchUpdateArea,
  fetchDeleteArea,
} from "@/app/services/areas";
import { fetchUsers } from "@/app/services/users";
import Header from "@/app/components/UI/Header";
import ConfirmToast from "@/app/components/UI/ConfirmToast";
import DS, { Loader } from "@/ds";

const RESPONSIBILITY_OPTIONS = [
  { value: "tech", label: "Tecnología" },
  { value: "technicalRequirement", label: "Requerimiento técnico" },
  { value: "workstations", label: "Puesto de trabajo" },
  { value: "assets_delivery", label: "Entrega de activos" },
  { value: "trainings", label: "Capacitaciones" },
  { value: "endowment", label: "Dotación" },
  { value: "carnet", label: "Carnet" },
];

const LABEL_MAP: Record<string, string> = Object.fromEntries(
  RESPONSIBILITY_OPTIONS.map((o) => [o.value, o.label]),
);

function parseValues(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw.split(",").filter(Boolean);
}

function joinValues(values: string[]): string {
  return values.join(",");
}

function BadgeList({ values }: { values: string[] }) {
  if (!values.length)
    return <span className="text-neutral-400 text-xs">—</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {values.map((v) => (
        <span
          key={v}
          className="bg-neutral-100 text-neutral-700 text-xs px-2 py-0.5 rounded-full whitespace-nowrap"
        >
          {LABEL_MAP[v] ?? v}
        </span>
      ))}
    </div>
  );
}

function CheckboxGroup({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };
  return (
    <div className="grid grid-cols-2 gap-2">
      {RESPONSIBILITY_OPTIONS.map((opt) => (
        <label
          key={opt.value}
          className="flex items-center gap-2 cursor-pointer text-sm text-neutral-700"
        >
          <input
            type="checkbox"
            checked={selected.includes(opt.value)}
            onChange={() => toggle(opt.value)}
            className="rounded"
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

export default function AreasPage() {
  const { data: session } = useSession();
  const { callApi, loading } = useApi(fetchAreas);
  const { callApi: callCreate, loading: loadingCreate } =
    useApi(fetchCreateArea);
  const { callApi: callEdit, loading: loadingEdit } = useApi(fetchUpdateArea);
  const { callApi: callDelete } = useApi(fetchDeleteArea);
  const { callApi: callUsers } = useApi(fetchUsers);

  const [areas, setAreas] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedArea, setSelectedArea] = useState<any>(null);

  const createRef = useRef<any>(null);
  const editRef = useRef<any>(null);
  const toastRef = useRef<any>(null);

  const [createForm, setCreateForm] = useState({
    name: "",
    directorId: "",
    responsability: [] as string[],
    responsabilities: [] as string[],
  });
  const [editForm, setEditForm] = useState({
    name: "",
    directorId: "",
    responsability: [] as string[],
    responsabilities: [] as string[],
  });

  useEffect(() => {
    if (session) {
      loadAreas();
      loadUsers();
    }
  }, [session]);

  const loadAreas = async () => {
    const data = await callApi();
    if (data) setAreas(data);
  };

  const loadUsers = async () => {
    const data = await callUsers();
    if (data) setUsers(data);
  };

  const handleCreate = () => {
    setCreateForm({
      name: "",
      directorId: "",
      responsability: [],
      responsabilities: [],
    });
    createRef.current?.showModal();
  };

  const handleSubmitCreate = async () => {
    try {
      await callCreate({
        name: createForm.name,
        directorId: parseInt(createForm.directorId),
        responsability: joinValues(createForm.responsability),
        responsabilities: joinValues(createForm.responsabilities),
      });
      createRef.current?.hideModal();
      toastRef.current?.show("Área creada correctamente");
      loadAreas();
    } catch {}
  };

  const handleEdit = (area: any) => {
    setSelectedArea(area);
    setEditForm({
      name: area.name,
      directorId: String(area.User?.id || area.directorId || ""),
      responsability: parseValues(area.responsability),
      responsabilities: parseValues(area.responsabilities),
    });
    editRef.current?.showModal();
  };

  const handleSubmitEdit = async () => {
    try {
      await callEdit({
        areaId: selectedArea.id,
        name: editForm.name,
        directorId: parseInt(editForm.directorId),
        responsability: joinValues(editForm.responsability),
        responsabilities: joinValues(editForm.responsabilities),
      });
      editRef.current?.hideModal();
      toastRef.current?.show("Área actualizada correctamente");
      loadAreas();
    } catch {}
  };

  const handleDelete = async (areaId: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta área?"))
      return;
    try {
      await callDelete({ areaId });
      toastRef.current?.show("Área eliminada correctamente");
      loadAreas();
    } catch {}
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  const userOptions = [
    { value: "", label: "Selecciona un director" },
    ...users.map((u) => ({ value: String(u.id), label: u.fullName })),
  ];

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      <Header />
      <main className="flex-1 px-20 py-6">
        <div className="mb-5 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">Áreas</h2>
            <p className="text-sm text-neutral-500 mt-1">Gestión de áreas</p>
          </div>
          <DS.Button
            variant="primary"
            size="lg"
            onClick={handleCreate}
            text="Crear área"
          />
        </div>

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
                    Director
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">
                    Correo director
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">
                    Responsabilidad
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">
                    Responsabilidades
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {areas.map((area) => (
                  <tr
                    key={area.id}
                    className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-neutral-500 font-mono text-xs">
                      {area.id}
                    </td>
                    <td className="px-4 py-3 font-medium text-neutral-900">
                      {area.name}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {area.User?.fullName ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {area.User?.email ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <BadgeList values={parseValues(area.responsability)} />
                    </td>
                    <td className="px-4 py-3">
                      <BadgeList values={parseValues(area.responsabilities)} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <DS.Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleEdit(area)}
                          text="Editar"
                        />
                        <DS.Button
                          variant="neutral"
                          size="sm"
                          onClick={() => handleDelete(area.id)}
                          text="Eliminar"
                          className="text-red-500"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
                {areas.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-neutral-400"
                    >
                      No hay áreas registradas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <DS.Modal
        ref={createRef}
        title="Crear área"
        size="md"
        footer={
          <DS.Button
            variant="primary"
            size="md"
            onClick={handleSubmitCreate}
            loading={loadingCreate}
            text="Crear"
          />
        }
      >
        <div className="flex flex-col gap-4">
          <DS.Input
            label="Nombre del área"
            value={createForm.name}
            onChange={(v: string) => setCreateForm((f) => ({ ...f, name: v }))}
          />
          <DS.Select
            label="Director"
            value={createForm.directorId}
            options={userOptions}
            onChange={(v: string) =>
              setCreateForm((f) => ({ ...f, directorId: v }))
            }
          />
          <div>
            <p className="text-sm font-medium text-neutral-700 mb-2">
              Responsabilidad (gestión para otras áreas)
            </p>
            <CheckboxGroup
              selected={createForm.responsability}
              onChange={(v) =>
                setCreateForm((f) => ({ ...f, responsability: v }))
              }
            />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-700 mb-2">
              Responsabilidades (requerimientos para esta área)
            </p>
            <CheckboxGroup
              selected={createForm.responsabilities}
              onChange={(v) =>
                setCreateForm((f) => ({ ...f, responsabilities: v }))
              }
            />
          </div>
        </div>
      </DS.Modal>

      <DS.Modal
        ref={editRef}
        title="Editar área"
        size="md"
        footer={
          <DS.Button
            variant="primary"
            size="md"
            onClick={handleSubmitEdit}
            loading={loadingEdit}
            text="Guardar"
          />
        }
      >
        <div className="flex flex-col gap-4">
          <DS.Input
            label="Nombre del área"
            value={editForm.name}
            onChange={(v: string) => setEditForm((f) => ({ ...f, name: v }))}
          />
          <DS.Select
            label="Director"
            value={editForm.directorId}
            options={userOptions}
            onChange={(v: string) =>
              setEditForm((f) => ({ ...f, directorId: v }))
            }
          />
          <div>
            <p className="text-sm font-medium text-neutral-700 mb-2">
              Responsabilidad (gestión para otras áreas)
            </p>
            <CheckboxGroup
              selected={editForm.responsability}
              onChange={(v) =>
                setEditForm((f) => ({ ...f, responsability: v }))
              }
            />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-700 mb-2">
              Responsabilidades (requerimientos para esta área)
            </p>
            <CheckboxGroup
              selected={editForm.responsabilities}
              onChange={(v) =>
                setEditForm((f) => ({ ...f, responsabilities: v }))
              }
            />
          </div>
        </div>
      </DS.Modal>

      <ConfirmToast ref={toastRef} />
    </div>
  );
}
