"use client";
import { useState, useEffect, useRef } from "react";
import {
  fetchDatasource,
  fetchUpdateDatasources,
  fetchDeleteDatasources,
} from "@/app/services/datasource";
import DS from "design-system";
import { useApi } from "@/app/hooks/useApi";
import { Database, FileWarning, Info, Save, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Tabs from "@/app/components/UI/Tabs";
import Checkbox from "@/app/components/UI/Checkbox";
import FloatBox from "@/app/components/UI/FloatBox";
import { useContextSelector } from "use-context-selector";
import { Context } from "@/app/providers/Session";

const ETL = ({ columns, datasource, setDatasourceWrapper, errors }: any) => {
  if (!columns) return null;
  return (
    <div>
      <div className="flex flex-col divide-y divide-neutral-200 text-sm">
        {columns.map((column: any) => (
          <div
            className="flex gap-3 items-center py-2 justify-between"
            key={column}
          >
            <div>{column}</div>
            <div>
              <DS.Select
                type="text"
                value={datasource.etl[column]}
                size="sm"
                onChange={(val: string) => {
                  setDatasourceWrapper({
                    etl: {
                      ...datasource.etl,
                      [column]: val,
                    },
                  });
                }}
                error={errors["etl." + column]}
              >
                <option value="">Seleccione una opción</option>
                <option value="companyCustomerId">ID</option>
                <option value="name">Nombre</option>
                <option value="email">Email</option>
                <option value="status">Estado</option>
                <option value="phone">Número de celular</option>
                <option value="website">Website</option>
                <option value="country">País</option>
                <option value="city">Ciudad</option>
                <option value="address">Dirección</option>
                <option value="status">Estado del cliente</option>
              </DS.Select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Datasource({ workspace, datasourceId }: any) {
  const router = useRouter();
  const modalDeleteRef: any = useRef(null);
  const [tab, setTab]: any = useState("general");
  const [datasource, setDatasource]: any = useState(null);
  const [form, setForm]: any = useState({});
  const { callApi, responded } = useApi(fetchDatasource);
  const showToastConfirm = useContextSelector(
    Context,
    (a) => a.showToastConfirm,
  );
  const {
    loading,
    errors,
    error,
    callApi: callApiUpdate,
  } = useApi(fetchUpdateDatasources);

  const { callApi: callApiDelete, loading: loadingDelete } = useApi(
    fetchDeleteDatasources,
  );

  const setDatasourceWrapper = (changes: any) => {
    setDatasource((prev: any) => ({
      ...prev,
      ...changes,
      hasChanges: true,
    }));
  };

  const getDatasource = () => {
    if (!workspace) return;
    callApi(workspace, datasourceId).then((result) => {
      setDatasource(result.Datasource);
    });
  };

  const handleUpdate = () => {
    callApiUpdate({
      datasourceId: datasource.id,
      ...datasource,
    })
      .then(() => {
        getDatasource();
        showToastConfirm("Conexión actualizada");
      })
      .catch((e) => {
        showToastConfirm(e?.message, "error");
      });
  };

  const handleClickDelete = async (_: any, datasource: any) => {
    modalDeleteRef.current.showModal();
    setForm({ ...form, id: datasource.id });
  };

  const handleDelete = async () => {
    await callApiDelete({
      datasourceId: form.id,
    });
    router.push(`/dashboard/${workspace}/settings`);
  };

  useEffect(() => {
    getDatasource();
  }, []);

  const handleSubmit = () => {
    handleUpdate && handleUpdate();
  };

  if (!datasource) return;
  if (!responded) return;

  return (
    <div className="flex min-h-full justify-center items-center">
      <FloatBox showing={datasource.hasChanges}>
        <div className="py-3 px-3 flex items-center gap-2 justify-between text-neutral-600 font-light">
          <div className="shrink-0">Cambios sin guardar</div>
          <DS.Button
            onClick={handleSubmit}
            text="Guardar"
            icon={Save}
            variant="primary"
            className="w-full "
            loading={loading}
            disabled={!datasource.name}
          />
        </div>
      </FloatBox>

      <div className="flex flex-col  text-black w-full max-w-[32rem] ">
        <motion.div
          className=" py-5 shadow-lg rounded-xl  border border-neutral-300  flex-col flex mb-5"
          transition={{
            duration: 0.2,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          initial={{ opacity: 0, y: 300, scale: 2 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
        >
          <Tabs
            currentTab={tab}
            onSelect={setTab}
            tabs={[
              { tab: "general", name: "Configurar conexión", icon: Settings },
              { tab: "etl", name: "Configurar ETL", icon: Database },
            ]}
          />

          {tab == "general" && (
            <>
              <div className="px-5 pt-3 pb-5 flex-col gap-3 flex ">
                <DS.Input
                  type="text"
                  value={datasource.name}
                  label="Nombre"
                  onChange={(val: string) => {
                    setDatasourceWrapper({ name: val });
                  }}
                  error={errors.name}
                />

                {datasource.type === "sheets" && (
                  <>
                    <DS.Input
                      type="text"
                      value={datasource.config.url}
                      label="URL de la hoja"
                      onChange={(url: string) => {
                        setDatasourceWrapper({
                          config: { ...datasource.config, url },
                        });
                      }}
                      error={errors["config.url"]}
                    />

                    <div>
                      {datasource.structure &&
                        Object.keys(datasource.structure).map((sheet: any) => (
                          <div
                            key={sheet}
                            onClick={() => {
                              setDatasourceWrapper({
                                config: {
                                  ...datasource.config,
                                  schema: sheet,
                                },
                              });
                            }}
                            className={` items-center gap-2 py-1 flex`}
                          >
                            <Checkbox
                              isChecked={datasource.config.schema == sheet}
                            />

                            <div className="text-sm font-light"> {sheet}</div>
                          </div>
                        ))}
                    </div>
                  </>
                )}

                {datasource.type != "sheets" && (
                  <>
                    <DS.Input
                      className="w-full"
                      type={"text"}
                      value={datasource.config["database"]}
                      label="Database"
                      error={errors["config.database"]}
                      onChange={(val: string) => {
                        setDatasourceWrapper({
                          config: { ...datasource.config, database: val },
                        });
                      }}
                    />

                    <div className="flex items-center gap-3 ">
                      <DS.Input
                        className="w-full"
                        type={"text"}
                        value={datasource.config["host"]}
                        label="Host"
                        error={errors["config.host"]}
                        onChange={(val: string) => {
                          setDatasourceWrapper({
                            config: { ...datasource.config, host: val },
                          });
                        }}
                      />
                      <DS.Input
                        className="w-full"
                        type={"text"}
                        value={datasource.config["port"]}
                        label="Port"
                        error={errors["config.port"]}
                        onChange={(val: string) => {
                          setDatasourceWrapper({
                            config: { ...datasource.config, port: val },
                          });
                        }}
                      />
                    </div>

                    <DS.Input
                      className="w-full"
                      type={"text"}
                      value={datasource.config["username"]}
                      label="Username"
                      error={errors["config.username"]}
                      onChange={(val: string) => {
                        setDatasourceWrapper({
                          config: { ...datasource.config, username: val },
                        });
                      }}
                    />

                    <DS.Input
                      className="w-full"
                      type={"text"}
                      value={datasource.config["password"]}
                      label="Password"
                      error={errors["config.password"]}
                      onChange={(val: string) => {
                        setDatasourceWrapper({
                          config: { ...datasource.config, password: val },
                        });
                      }}
                    />

                    <DS.Checkbox
                      value={datasource.config.ssh}
                      label="Usar SSH"
                      onChange={(ssh: boolean) => {
                        setDatasourceWrapper({
                          config: { ...datasource.config, ssh },
                        });
                      }}
                      error={errors["config.ssh"]}
                      className="py-3"
                    />

                    {datasource.config.ssh && (
                      <>
                        <DS.Select
                          value={datasource.config.ssh_login_type}
                          label="Login Type"
                          error={errors["config.ssh_login_type"]}
                          onChange={(ssh_login_type: string) => {
                            setDatasourceWrapper({
                              config: { ...datasource.config, ssh_login_type },
                            });
                          }}
                        >
                          <option value="user">User</option>
                          <option value="key">Key</option>
                        </DS.Select>

                        <div className="flex items-center gap-3">
                          <DS.Input
                            type="text"
                            value={datasource.config.ssh_host}
                            label="SSH Host"
                            error={errors["config.ssh_host"]}
                            onChange={(val: string) => {
                              setDatasourceWrapper({
                                config: { ...datasource.config, ssh_host: val },
                              });
                            }}
                          />
                          <DS.Input
                            type="number"
                            value={datasource.config.ssh_port}
                            label={"SSH Port"}
                            error={errors["config.ssh_port"]}
                            onChange={(ssh_port: string) => {
                              setDatasourceWrapper({
                                config: { ...datasource.config, ssh_port },
                              });
                            }}
                          />
                        </div>
                        <DS.Input
                          type={"text"}
                          value={datasource.config.ssh_username}
                          label={"SSH User"}
                          error={errors["config.ssh_username"]}
                          onChange={(val: string) => {
                            setDatasourceWrapper({
                              config: {
                                ...datasource.config,
                                ssh_username: val,
                              },
                            });
                          }}
                        />
                        {datasource.config.ssh_login_type === "key" && (
                          <DS.Textarea
                            value={datasource.config.ssh_password}
                            label={"SSH Private Key"}
                            error={errors["config.ssh_password"]}
                            onChange={(val: string) => {
                              setDatasourceWrapper({
                                config: {
                                  ...datasource.config,
                                  ssh_password: val,
                                },
                              });
                            }}
                          />
                        )}
                        {datasource.config.ssh_login_type === "user" && (
                          <DS.Input
                            type={"password"}
                            value={datasource.config.ssh_password}
                            label={"SSH Password"}
                            error={errors["config.ssh_password"]}
                            onChange={(val: string) => {
                              setDatasourceWrapper({
                                config: {
                                  ...datasource.config,
                                  ssh_password: val,
                                },
                              });
                            }}
                          />
                        )}
                      </>
                    )}

                    <DS.Textarea
                      className="w-full"
                      type={"text"}
                      value={datasource.config["sql"]}
                      label="SQL"
                      placeholder="SELECT * FROM table"
                      error={errors["config.sql"]}
                      onChange={(val: string) => {
                        setDatasourceWrapper({
                          config: { ...datasource.config, sql: val },
                        });
                      }}
                    />
                  </>
                )}
              </div>

              {error && (
                <div className="font-light bg-red-700 text-red-200 text-sm px-5 py-3 select-text">
                  {error}
                </div>
              )}
            </>
          )}

          {tab == "etl" && (
            <div className="px-5">
              <ETL
                columns={datasource.structure[datasource.config.schema]}
                errors={errors}
                datasource={datasource}
                setDatasourceWrapper={setDatasourceWrapper}
              />
            </div>
          )}

          {datasource.type !== "sheets" && (
            <div className="font-light text-neutral-600 text-sm mt-3 px-3">
              Tus credenciales son guardadas encriptadas
            </div>
          )}
        </motion.div>

        <div
          onClick={(event) => {
            handleClickDelete(event, datasource);
          }}
          className="items-center flex gap-2 bg-neutral-300 text-neutral-800 py-3 px-5 border border-neutral-400 rounded-xl shadow-xl select-none text-sm font-light border-glow"
        >
          <FileWarning className="size-5" />
          <div> Eliminar conector</div>
        </div>
        <DS.Modal
          title="Eliminar conector"
          footer={
            <div className="flex items-center gap-5">
              <DS.Button
                text="No, cancelar"
                onClick={() => modalDeleteRef.current.hideModal()}
                variant="secondary"
                className="w-full"
                size="md"
              />
              <DS.Button
                text="Si, eliminar"
                onClick={() => handleDelete()}
                variant="primary"
                className="w-full"
                size="md"
                loading={loadingDelete}
                disabled={form.textDeleteView != "si, eliminar"}
              />
            </div>
          }
          size="sm"
          ref={modalDeleteRef}
        >
          <span className="mb-10 bg-amber-200 text-amber-700 px-3 py-1 border-glow flex gap-3 item-center">
            <Info className="size-10 " />
            <span className="text-sm font-light">
              Eliminar un conector puede causar que tus sincronizaciones dejen
              de funcionar.
            </span>
          </span>

          <DS.Input
            type="text"
            value={form.textDeleteView}
            label="Escribe (si, eliminar)"
            className="mb-3"
            onChange={(val: string) => {
              setForm({ ...form, textDeleteView: val });
            }}
          />
        </DS.Modal>
      </div>
    </div>
  );
}
