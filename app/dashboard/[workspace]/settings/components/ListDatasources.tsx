"use client";
import { useState, useEffect, useRef } from "react";
import { fetchDatasources, syncDatasource } from "@/app/services/datasource";
import DS from "design-system";
import { useApi } from "@/app/hooks/useApi";
import { PlusCircle, RefreshCw, TriangleAlert, X } from "lucide-react";
import CreateDatasource from "./CreateDatasource";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Tooltip from "@/app/components/UI/ToolTip";
import { useContextSelector } from "use-context-selector";
import { Context } from "@/app/providers/Session";

export default function SettingsView({ workspace }: { workspace: string }) {
  const [view, setView] = useState("list");
  const router = useRouter();
  const modalLogs = useRef<any>(null);
  const [datasources, setDatasources]: any = useState([]);
  const [datasource, setDatasource]: any = useState(null);
  const { callApi, responded } = useApi(fetchDatasources);
  const { callApi: sync, loading } = useApi(syncDatasource);
  const showToastConfirm = useContextSelector(
    Context,
    (a) => a.showToastConfirm,
  );

  const getDatasources = () => {
    if (!workspace) return;
    callApi(workspace).then((result) => {
      setDatasources(result.Datasource);
    });
  };

  const callSync = (datasource: any) => {
    sync(workspace, datasource.id)
      .then(() => {
        getDatasources();
      })
      .then(() => {
        showToastConfirm("Datos sincronizados");
      })
      .catch((e) => {
        showToastConfirm(e?.message, "error");
      });
  };

  useEffect(() => {
    getDatasources();
  }, []);

  const images: any = {
    mysql: "/logos/mysql.png",
    postgresql: "/logos/pg.png",
    sheets: "/logos/sheets.png",
    mssql: "/logos/mssql.svg",
    oracle: "/logos/oracle.png",
  };

  if (!responded) return;

  if (view == "create" || datasources.length == 0) {
    return (
      <>
        {datasources.length > 0 && (
          <X
            className="absolute top-4 right-3 text-neutral-500 hover:text-neutral-700 cursor-pointer"
            onClick={() => setView("list")}
          />
        )}
        <CreateDatasource
          workspace={workspace}
          currentDatasources={datasources.length}
        />
      </>
    );
  }
  return (
    <>
      <DS.Button
        onClick={() => setView("create")}
        text="Crear conector"
        icon={PlusCircle}
        variant="primary"
        size="sm"
        className="absolute top-3 right-3"
      />

      <div className="flex-col flex bg-transparent text-neutral-700 cursor-default  divide-y divide-neutral-200">
        {datasources.map((d: any, index: number) => (
          <motion.div
            key={d.id}
            className="flex items-center gap-3 py-3 hover:bg-neutral-100 px-3 rounded-xl"
            onClick={() => {
              router.push(`/dashboard/${workspace}/settings/${d.id}`);
            }}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.1 * index,
              duration: 0.2,
              ease: [0, 0.71, 0.2, 1.01],
            }}
          >
            <div className="w-6">
              <img src={images[d.type]} className="max-w-6 max-h-6" />
            </div>
            <div className="flex items-center gap-5 mr-auto">
              <div>{d.name}</div>
              <div className="text-sm text-neutral-500 font-light ">
                {d.rows} registros
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip tooltip="Sincronizar">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    if (loading) {
                      return;
                    }
                    callSync(d);
                    setDatasource(d);
                  }}
                  className={`px-3 py-1 rounded-lg bg-neutral-100 ${
                    loading && datasource?.id == d?.id
                      ? "cursor-not-allowed"
                      : "hover:bg-neutral-200"
                  }`}
                >
                  <RefreshCw
                    className={`size-4 text-neutral-500 cursor-pointer ${
                      loading && datasource?.id == d?.id ? "animate-spin" : ""
                    }`}
                  />
                </div>
              </Tooltip>
              {d.logs?.length > 0 && (
                <div
                  className="text-xs font-light text-yellow-600 "
                  onClick={(e) => {
                    e.stopPropagation();
                    setDatasource(d);
                    if (!modalLogs.current) return;
                    modalLogs.current.showModal();
                  }}
                >
                  <Tooltip tooltip="Tiene novedades">
                    <TriangleAlert className="size-6" />
                  </Tooltip>
                </div>
              )}
            </div>

            {d.lastUseAt && (
              <div className="text-xs font-light text-neutral-500 ">
                Última sincronización {d.lastUseAt}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <DS.Modal
        title="Logs de sincronización"
        ref={modalLogs}
        position="center"
        size="sm"
      >
        <div className="text-sm divide-y divide-neutral-200">
          {datasource?.logs?.map((log: any, index: number) => (
            <div key={index} className="flex items-center gap-3 py-2 ">
              <div
                className={`text-xs font-light   px-3 py-2 rounded-lg
                ${log.type == "error" && "bg-red-100 text-red-600"}
                ${log.type == "warn" && "bg-yellow-100 text-yellow-600"}
                `}
              >
                {log.type}
              </div>
              <div className="text-sm font-light text-neutral-600">
                {log.log}
              </div>
            </div>
          ))}
        </div>
      </DS.Modal>
    </>
  );
}
