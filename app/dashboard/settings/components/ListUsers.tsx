"use client";
import { useEffect, useState, useRef } from "react";
import { Ellipsis, Plus, Trash } from "lucide-react";
import DS from "design-system";
import {
  fetchUsers,
  fetchUser,
  fetchAddUser,
  fetchUpdateUser,
  fetchDeleteUser,
} from "@/app/services/users";
import { useSession } from "@/app/hooks/useSession";
import AddCreditCard from "@/app/components/UI/AddCreditCard";
import AvatarName from "@/app/components/UI/AvatarName";
import { useApi } from "@/app/hooks/useApi";
import { fetchWorkspaces } from "@/app/services/workspace";
import Card from "../../settings/components/Card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/app/components/UI/Dropdown";
import { motion } from "framer-motion";

export default function ListUsers() {
  const [workspaces, setWorkspaces] = useState([]);
  const { data: session }: any = useSession();
  const isAdmin = session?.user?.rol === "admin";
  const modalRef: any = useRef(null);
  const modalDeleteRef: any = useRef(null);
  const [users, setUsers] = useState([]);
  const [form, setForm]: any = useState({ permissions: {}, rol: "admin" });
  const [loadingUser, setLoadingUser] = useState(false);

  const { loading: loadingUsers, callApi } = useApi(fetchUsers);
  const {
    loading: loadingAdd,
    errors: errorsAdd,
    callApi: callApiAdd,
  } = useApi(fetchAddUser);
  const {
    loading: loadingUpdate,
    errors: errorsUpdate,
    callApi: callApiUpdate,
  } = useApi(fetchUpdateUser);

  const { callApi: callApiWorkspace } = useApi(fetchWorkspaces);
  // const { callApi: callApiViews, loading: loadingViews } = useApi(viewList);
  const { loading: loadingDelete, callApi: callApiDelete } =
    useApi(fetchDeleteUser);

  const listViews = async (workspaceId: string | null) => {
    if (!workspaceId) return;
    // const result = await callApiViews(workspaceId);
    // setViews(result.Views);
  };

  const getUsers = async () => {
    setUsers([]);
    const result = await callApi();
    setUsers(result.Users);
  };

  const handleClickSubmitNewUser = async () => {
    await callApiAdd(form);
    modalRef.current.hideModal();
    getUsers();
  };

  const getWorkspaces = async () => {
    const result = await callApiWorkspace(null);
    setWorkspaces(result.Workspaces);
  };

  const handleClickSubmitUpdateUser = async () => {
    await callApiUpdate({
      ...form,
      userId: form.id,
    });
    modalRef.current.hideModal();
    getUsers();
  };

  const createNewUser = () => {
    if (!isAdmin) return;
    setForm({ permissions: {}, rol: "admin" });
    setLoadingUser(false);
    modalRef.current.showModal();
  };

  const handleClickUser = async (user: any) => {
    if (user.id == session?.user?.id) return;
    if (!isAdmin) return;
    setLoadingUser(true);
    modalRef.current.showModal();
    const result = await fetchUser(user.id);
    setForm({ ...form, ...result.User });
    setLoadingUser(false);
  };

  const handleClickDeleteUser = async (e: any, user: any) => {
    e.preventDefault();
    e.stopPropagation();
    modalDeleteRef.current.showModal();
    setForm({ ...form, id: user.id });
  };
  const handleDeleteUser = async () => {
    await callApiDelete({
      userId: form.id,
    });
    modalDeleteRef.current.hideModal();
    getUsers();
  };

  useEffect(() => {
    getUsers();
    getWorkspaces();
  }, []);

  useEffect(() => {
    listViews(form.workspaceId);
  }, [form.workspaceId]);

  return (
    <div className="flex flex-col gap-5 relative">
      {users.length > 0 && (
        <Card
          title={
            <div className="flex justify-between gap-3 items-center">
              <div>{users?.length} Usuarios</div>
              {isAdmin &&
                users.length >= session?.business?.limitUsers &&
                !session?.business?.addedCard && (
                  <div>
                    <AddCreditCard text="Necesitas añadir una tarjeta de crédito para crear más usuarios" />
                  </div>
                )}
              {!loadingUsers &&
                isAdmin &&
                (users.length < session?.business?.limitUsers ||
                  session?.business?.addedCard) && (
                  <DS.Button
                    text="Añadir nuevo usuario"
                    onClick={() => createNewUser()}
                    variant="primary"
                    icon={Plus}
                    className="ml-auto"
                    size="sm"
                  />
                )}
            </div>
          }
          body={
            <div className="flex flex-col select-none">
              {users.map((user: any, index: number) => (
                <motion.div
                  onClick={() => handleClickUser(user)}
                  key={user.id}
                  className="group/item py-3 flex items-center gap-3 text-black font-light text-sm"
                  transition={{
                    delay: 0.1 * index,
                    duration: 0.2,
                    ease: [0, 0.71, 0.2, 1.01],
                  }}
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <AvatarName
                    name={user.name}
                    image={user.image}
                    colorIndex={-1}
                    size="sm"
                  />
                  <div>
                    <div className="">{user.name}</div>
                    <div className="font-light text-xs dark:text-neutral-500 text-neutral-700">
                      {user.email}
                    </div>
                  </div>

                  {user.lastActionAt && (
                    <div className="ml-auto text-xs font-light text-neutral-500">
                      <span>Último uso</span>{" "}
                      <span className="text-white">{user.lastActionAt}</span>
                    </div>
                  )}
                  <span className="text-xs font-light text-neutral-700 bg-neutral-200 px-2 py-0.5 rounded-xl mr-2">
                    {user.rol}
                  </span>

                  <div className="w-8 ml-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="h-full outline-none">
                        <Ellipsis className="size-6 text-neutral-400 hover:text-neutral-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent sideOffset={0} className=" mb-3  ">
                        {session?.user?.id != user.id && (
                          <DropdownMenuItem
                            onClick={(event) => {
                              handleClickDeleteUser(event, user);
                            }}
                            className="items-center flex gap-2"
                          >
                            Eliminar usuario
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              ))}
            </div>
          }
        />
      )}

      <DS.Modal
        title="Editar usuario"
        footer={
          <DS.Button
            text="Guardar"
            onClick={() =>
              form.id
                ? handleClickSubmitUpdateUser()
                : handleClickSubmitNewUser()
            }
            variant="primary"
            className="w-full"
            size="md"
            loading={loadingAdd || loadingUpdate}
          />
        }
        size="sm"
        ref={modalRef}
      >
        {(loadingUser || loadingUpdate) && (
          <div className=" flex items-center justify-center">
            <DS.Loader size="md" />
          </div>
        )}
        {!(loadingUser || loadingUpdate) && (
          <div className="flex gap-3 flex-col">
            {form.id && (
              <a
                target="_blank"
                href={`/api/users/downloadLogs?userId=${form.id}`}
                className="underline text-right text-sm font-medium pointer"
              >
                Descargar registros de usuario
              </a>
            )}

            <DS.Input
              type="text"
              value={form.name}
              error={errorsAdd?.name || errorsUpdate?.name}
              label="Nombre"
              onChange={(name: string) => {
                setForm({ ...form, name });
              }}
            />

            {!form.id && (
              <>
                <DS.Input
                  error={errorsAdd?.email || errorsUpdate?.email}
                  type="text"
                  value={form.email}
                  label="Email"
                  onChange={(val: string) => {
                    setForm({ ...form, email: val });
                  }}
                />

                <DS.Input
                  error={errorsAdd?.password || errorsUpdate?.password}
                  type="password"
                  value={form.password}
                  label="Password"
                  onChange={(val: string) => {
                    setForm({ ...form, password: val });
                  }}
                />
              </>
            )}

            <DS.Select
              value={form.rol}
              error={errorsAdd?.rol || errorsUpdate?.rol}
              label="Rol"
              onChange={(val: string) => {
                setForm({ ...form, rol: val });
              }}
            >
              <option value="admin">Admin</option>
              {/* <option value="editor">Editor</option> */}
              <option value="user">User</option>
            </DS.Select>

            {form.rol != "admin" && (
              <div>
                <DS.Select
                  value={form.workspaceId}
                  label="Workspace"
                  onChange={(workspaceId: string) => {
                    setForm({ ...form, workspaceId });
                  }}
                >
                  <option value="">Select</option>
                  {workspaces.map((workspace: any) => (
                    <option key={workspace.id} value={workspace.id}>
                      {workspace.name}
                    </option>
                  ))}
                </DS.Select>

                <div className="mt-5"></div>
              </div>
            )}
          </div>
        )}
      </DS.Modal>

      <DS.Modal
        title="Eliminar usuario"
        footer={
          <div className="flex items-center gap-5">
            <DS.Button
              text="No, cancel"
              onClick={() => modalDeleteRef.current.hideModal()}
              variant="primary"
              className="w-full"
              size="md"
            />
            <DS.Button
              text="Yes, delete"
              onClick={() => handleDeleteUser()}
              variant="primary"
              className="w-full"
              size="md"
              loading={loadingDelete}
              disabled={form.textDeleteView != "yes, delete"}
            />
          </div>
        }
        size="sm"
        ref={modalDeleteRef}
      >
        <DS.Input
          type="text"
          value={form.textDeleteView}
          label="Write (yes, delete)"
          className="mb-3"
          onChange={(val: string) => {
            setForm({ ...form, textDeleteView: val });
          }}
        />
      </DS.Modal>
    </div>
  );
}
