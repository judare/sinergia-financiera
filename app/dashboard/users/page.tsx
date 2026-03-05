"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "@/app/hooks/useSession";
import { useApi } from "@/app/hooks/useApi";
import {
  fetchUsers,
  fetchCreateUser,
  fetchUpdateUser,
  fetchDeleteUser,
} from "@/app/services/users";
import { postRequest } from "@/app/services/_base";
import Header from "@/app/components/UI/Header";
import ConfirmToast from "@/app/components/UI/ConfirmToast";
import DS, { Loader } from "@/ds";

export default function Home() {
  const { data: session } = useSession();
  const { callApi, loading } = useApi(fetchUsers);
  const { callApi: callCreate, loading: loadingCreate } =
    useApi(fetchCreateUser);
  const { callApi: callEdit, loading: loadingEdit } = useApi(fetchUpdateUser);
  const { callApi: callDelete } = useApi(fetchDeleteUser);

  const [users, setUsers] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const createRef = useRef<any>(null);
  const editRef = useRef<any>(null);
  const toastRef = useRef<any>(null);

  const [createForm, setCreateForm] = useState({
    fullName: "",
    email: "",
    password: "",
    areaId: "",
  });
  const [editForm, setEditForm] = useState({ fullName: "", areaId: "" });

  useEffect(() => {
    if (session) {
      loadUsers();
      loadAreas();
    }
  }, [session]);

  const loadUsers = async () => {
    const data = await callApi();
    if (data) setUsers(data);
  };

  const loadAreas = async () => {
    try {
      const result = await postRequest("onboarding/areas", {});
      setAreas(result.data.Areas);
    } catch {}
  };

  const handleCreate = () => {
    setCreateForm({ fullName: "", email: "", password: "", areaId: "" });
    createRef.current?.showModal();
  };

  const handleSubmitCreate = async () => {
    try {
      await callCreate({
        ...createForm,
        areaId: parseInt(createForm.areaId),
      });
      createRef.current?.hideModal();
      toastRef.current?.show("Usuario creado correctamente");
      loadUsers();
    } catch {}
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setEditForm({
      fullName: user.fullName,
      areaId: String(user.Area?.id || ""),
    });
    editRef.current?.showModal();
  };

  const handleSubmitEdit = async () => {
    try {
      await callEdit({
        userId: selectedUser.id,
        fullName: editForm.fullName,
        areaId: parseInt(editForm.areaId),
      });
      editRef.current?.hideModal();
      toastRef.current?.show("Usuario actualizado correctamente");
      loadUsers();
    } catch {}
  };

  const handleDelete = async (userId: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?"))
      return;
    try {
      await callDelete({ userId });
      toastRef.current?.show("Usuario eliminado correctamente");
      loadUsers();
    } catch {}
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  const areaOptions = [
    { value: "", label: "Selecciona un área" },
    ...areas.map((a) => ({ value: String(a.id), label: a.name })),
  ];

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      <Header />
      <main className="flex-1 px-20 py-6">
        <div className="mb-5 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">Usuarios</h2>
            <p className="text-sm text-neutral-500 mt-1">Gestión de usuarios</p>
          </div>
          <DS.Button
            variant="primary"
            size="lg"
            onClick={handleCreate}
            text="Crear usuario"
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
                    Área
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">
                    Correo
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-neutral-500 font-mono text-xs">
                      <a href={`/dashboard/users/${user.id}`}>{user.id}</a>
                    </td>
                    <td className="px-4 py-3 font-medium text-neutral-900">
                      {user.fullName}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {user.Area?.name}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <DS.Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleEdit(user)}
                          text="Editar"
                        />
                        <DS.Button
                          variant="neutral"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                          text="Eliminar"
                          className="text-red-500"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <DS.Modal
        ref={createRef}
        title="Crear usuario"
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
            label="Nombre completo"
            value={createForm.fullName}
            onChange={(v: string) =>
              setCreateForm((f) => ({ ...f, fullName: v }))
            }
          />
          <DS.Input
            label="Email"
            type="email"
            value={createForm.email}
            onChange={(v: string) => setCreateForm((f) => ({ ...f, email: v }))}
          />
          <DS.Input
            label="Contraseña"
            type="password"
            value={createForm.password}
            onChange={(v: string) =>
              setCreateForm((f) => ({ ...f, password: v }))
            }
          />
          <DS.Select
            label="Área"
            value={createForm.areaId}
            options={areaOptions}
            onChange={(v: string) =>
              setCreateForm((f) => ({ ...f, areaId: v }))
            }
          />
        </div>
      </DS.Modal>

      <DS.Modal
        ref={editRef}
        title="Editar usuario"
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
            label="Nombre completo"
            value={editForm.fullName}
            onChange={(v: string) =>
              setEditForm((f) => ({ ...f, fullName: v }))
            }
          />
          <DS.Select
            label="Área"
            value={editForm.areaId}
            options={areaOptions}
            onChange={(v: string) => setEditForm((f) => ({ ...f, areaId: v }))}
          />
        </div>
      </DS.Modal>

      <ConfirmToast ref={toastRef} />
    </div>
  );
}
