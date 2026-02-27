"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "@/app/hooks/useSession";
import { useApi } from "@/app/hooks/useApi";
import { fetchUsers } from "@/app/services/users";
import Header from "@/app/components/UI/Header";
import DS, { Loader } from "@/ds";

export default function Home() {
  const { data: session } = useSession();
  const { callApi, loading } = useApi(fetchUsers);
  const [users, setUsers] = useState<any[]>([]);
  const createRef = useRef<any>(null);

  useEffect(() => {
    if (session) {
      loadUsers();
    }
  }, [session]);

  const loadUsers = async () => {
    const data = await callApi();
    if (data) setUsers(data);
  };

  const handleCreate = function () {
    createRef.current?.showModal();
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
                    Rol
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((process) => (
                  <tr
                    key={process.id}
                    className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-neutral-500 font-mono text-xs">
                      <a href={`/dashboard/users/${process.id}`}>
                        {process.id}
                      </a>
                    </td>
                    <td className="px-4 py-3 font-medium text-neutral-900">
                      {process.fullName}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {process.Area?.name}
                    </td>

                    <td className="px-4 py-3 text-neutral-600">
                      {process.Role?.name}
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
