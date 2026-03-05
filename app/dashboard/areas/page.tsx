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

export default function AreasPage() {
  const { data: session } = useSession();
  const { callApi, loading } = useApi(fetchAreas);
  const { callApi: callCreate, loading: loadingCreate } = useApi(fetchCreateArea);
  const { callApi: callEdit, loading: loadingEdit } = useApi(fetchUpdateArea);
  const { callApi: callDelete } = useApi(fetchDeleteArea);
  const { callApi: callUsers } = useApi(fetchUsers);

  const [areas, setAreas] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedArea, setSelectedArea] = useState<any>(null);

  const createRef = useRef<any>(null);
  const editRef = useRef<any>(null);
  const toastRef = useRef<any>(null);

  const [createForm, setCreateForm] = useState({ name: "", directorId: "" });
  const [editForm, setEditForm] = useState({ name: "", directorId: "" });

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
    setCreateForm({ name: "", directorId: "" });
    createRef.current?.showModal();
  };

  const handleSubmitCreate = async () => {
    try {
      await callCreate({
        name: createForm.name,
        directorId: parseInt(createForm.directorId),
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
    });
    editRef.current?.showModal();
  };

  const handleSubmitEdit = async () => {
    try {
      await callEdit({
        areaId: selectedArea.id,
        name: editForm.name,
        directorId: parseInt(editForm.directorId),
      });
      editRef.current?.hideModal();
      toastRef.current?.show("Área actualizada correctamente");
      loadAreas();
    } catch {}
  };

  const handleDelete = async (areaId: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta área?")) return;
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
                    <td colSpan={5} className="px-4 py-8 text-center text-neutral-400">
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
        size="sm"
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
        <div className="flex flex-col gap-3">
          <DS.Input
            label="Nombre del área"
            value={createForm.name}
            onChange={(v: string) => setCreateForm((f) => ({ ...f, name: v }))}
          />
          <DS.Select
            label="Director"
            value={createForm.directorId}
            options={userOptions}
            onChange={(v: string) => setCreateForm((f) => ({ ...f, directorId: v }))}
          />
        </div>
      </DS.Modal>

      <DS.Modal
        ref={editRef}
        title="Editar área"
        size="sm"
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
        <div className="flex flex-col gap-3">
          <DS.Input
            label="Nombre del área"
            value={editForm.name}
            onChange={(v: string) => setEditForm((f) => ({ ...f, name: v }))}
          />
          <DS.Select
            label="Director"
            value={editForm.directorId}
            options={userOptions}
            onChange={(v: string) => setEditForm((f) => ({ ...f, directorId: v }))}
          />
        </div>
      </DS.Modal>

      <ConfirmToast ref={toastRef} />
    </div>
  );
}
