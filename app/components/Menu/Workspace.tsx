"use client";
import { useState, useRef } from "react";
import DS from "design-system";
import { fetchAddWorkspace } from "@/app/services/workspace";
import { useApi } from "@/app/hooks/useApi";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/UI/Dropdown";
import { useSession } from "@/app/hooks/useSession";
import { Context } from "../../providers/Workspace";
import { ChevronsUpDown, PlusCircle } from "lucide-react";
import { useContext } from "use-context-selector";
import AvatarName from "../UI/AvatarName";

export default function Workspace() {
  const { data: session }: any = useSession();
  const router = useRouter();

  const [form, setForm] = useState({ name: "" });
  const modalAdd: any = useRef(null);

  const isAdmin = session?.user?.rol == "admin";

  const { loading, workspaces, currentWorkspace } = useContext(Context);

  const {
    loading: loadingAdd,
    callApi: callApiAdd,
    errors,
  } = useApi(fetchAddWorkspace);

  const handleSubmit = () => {
    callApiAdd(form).then((result: any) => {
      if (result.Workspace.slug) {
        router.push(`/dashboard/${result.Workspace.slug}`);
      }
    });
  };

  return (
    <>
      <div className="flex items-center justify-between gap-3 md:border-b border-neutral-300 md:mb-3 md:pb-3 select-none py-3 w-full pl-3">
        <a
          className=""
          href={
            currentWorkspace
              ? `/dashboard/${currentWorkspace?.id ?? ""}`
              : "/dashboard"
          }
        >
          <div className=" flex items-center justify-center shrink-0 size-6 rounded-lg bg-black ">
            <img
              src="/logo-sm-white.svg"
              className=" h-4 shrink-0 hidden md:block"
            />
          </div>
        </a>

        <DropdownMenu>
          <DropdownMenuTrigger className="select-none text-neutral-600 dark:text-neutral-300 w-full focus:outline-none">
            <div className="hover:bg-white  dark:hover:bg-neutral-800 rounded-xl px-3 py-2 flex items-center gap-3">
              <div className="truncate">
                {currentWorkspace?.name || "Seleccionar"}
              </div>
              <div className="ml-auto">
                {loading && <DS.Loader size="sm" className="mx-auto" />}
                {!loading && (
                  <ChevronsUpDown className="size-5 ml-auto text-neutral-700 dark:text-neutral-500" />
                )}
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className=" w-72">
            <DropdownMenuLabel className="text-xs text-neutral-500 pb-3 pt-3 font-medium">
              Workspaces
            </DropdownMenuLabel>
            {/* <DropdownMenuSeparator /> */}
            <div className="flex flex-col w-full gap-1">
              {workspaces.map((workspace: any, index: number) => (
                <a
                  key={workspace.id}
                  href={`/dashboard/${workspace.id}`}
                  className={`flex items-center gap-2 px-2 rounded-xl py-0.5 w-full truncate text-sm ${
                    currentWorkspace?.id == workspace.id
                      ? "font-bold  text-black"
                      : " text-neutral-600"
                  }`}
                >
                  <AvatarName
                    name={workspace.name}
                    size="sm"
                    colorIndex={index}
                  />

                  <div>
                    <div className="text-neutral-700 font-light">
                      {workspace.name}
                    </div>
                  </div>
                </a>
              ))}
            </div>
            <DropdownMenuSeparator />
            {isAdmin && (
              <div className="py-2 px-2">
                <DS.Button
                  size="sm"
                  className="w-full"
                  icon={PlusCircle}
                  variant="third"
                  onClick={() => {
                    modalAdd.current.showModal();
                  }}
                  text="Add workspace"
                />
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DS.Modal
        title="Add Workspace"
        darkMode={true}
        footer={
          <div className="flex items-center gap-5">
            <DS.Button
              text="Cancel"
              onClick={() => modalAdd.current.hideModal()}
              variant="secondary"
              className="w-full"
              size="md"
            />
            <DS.Button
              text="Confirm"
              onClick={() => handleSubmit()}
              variant="primary"
              className="w-full"
              size="md"
              loading={loadingAdd}
              disabled={!form.name}
            />
          </div>
        }
        size="sm"
        ref={modalAdd}
      >
        <DS.Input
          type="text"
          value={form.name}
          label="Name"
          className="mb-3"
          error={errors?.name}
          onChange={(val: string) => {
            setForm({ ...form, name: val });
          }}
        />
      </DS.Modal>
    </>
  );
}
