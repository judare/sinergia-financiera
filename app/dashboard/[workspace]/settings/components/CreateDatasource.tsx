import { useState } from "react";
import { motion } from "framer-motion";
import { fetchCreateDatasource } from "@/app/services/datasource";
import { useApi } from "@/app/hooks/useApi";
import Sheets from "./Sheets";
import DS from "design-system";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { useSession } from "@/app/hooks/useSession";
import UpgradePlan from "@/app/dashboard/settings/components/UpgradePlan";

export default function CreateDatasource({
  workspace,
  currentDatasources,
}: any) {
  const [form, setForm]: any = useState(null);
  const [visual, setVisual]: any = useState("create");
  const { data: session }: any = useSession();
  const router = useRouter();
  const {
    callApi: callApiCreate,
    errors,
    loading,
  } = useApi(fetchCreateDatasource);

  const clickDb = (type: string) => {
    setVisual("database-form");
    setForm({
      name: "your-datasource",
      type: type,
      config: {},
    });
  };

  const connectorsDb = [
    {
      key: "mysql",
      name: "Mysql",
      image: "/logos/mysql.png",
      onClick: () => clickDb("mysql"),
    },
    {
      key: "postgresql",
      name: "Postgresql",
      image: "/logos/pg.png",
      onClick: () => clickDb("postgresql"),
    },
    {
      key: "mssql",
      name: "mssql",
      image: "/logos/mssql.svg",
      onClick: () => clickDb("mssql"),
    },
    {
      key: "oracle",
      name: "Oracle",
      image: "/logos/oracle.png",
      onClick: () => clickDb("oracle"),
    },
  ];

  const connectorsOthers = [
    {
      name: "Google Sheets",
      image: "/logos/sheets.png",
      onClick: () => {
        setVisual("sheets");
      },
    },
  ];

  const handleCreate = (form: any) => {
    callApiCreate({
      workspaceId: workspace,
      ...form,
    }).then((result: any) => {
      router.push(`/dashboard/${workspace}/settings/${result.Datasource.id}`);
    });
  };

  if (currentDatasources >= session?.plan?.limitDatasources) {
    return (
      <div>
        <UpgradePlan />
      </div>
    );
  }

  return (
    <div className="min-h-full flex justify-center items-center select-none">
      <div className="py-10 shadow-md my-10 rounded-xl border border-neutral-300 w-full px-5 max-w-[32rem] mx-auto ">
        {visual == "database-form" && (
          <div>
            <DS.Input
              type="text"
              value={form.name}
              label="Nombre"
              onChange={(val: string) => {
                setForm({ ...form, name: val });
              }}
              error={errors.name}
            />

            <DS.Button
              onClick={() => {
                handleCreate(form);
              }}
              text="Crear"
              icon={Save}
              variant="primary"
              className="w-full mt-3"
              loading={loading}
            />
          </div>
        )}

        {visual == "sheets" && <Sheets workspace={workspace} />}

        {visual == "create" && (
          <>
            <h2 className="mb-3 font-light text-xs uppercase">Conectores</h2>
            <div className="flex flex-wrap gap-3">
              {connectorsOthers.map((connector: any, index: number) => (
                <motion.div
                  className=" flex items-center py-3 px-5 gap-3 border border-neutral-200 rounded-xl group hover:bg-neutral-100 shadow-sm"
                  transition={{
                    delay: 0.1 * index,
                    duration: 0.2,
                    ease: [0, 0.71, 0.2, 1.01],
                  }}
                  initial={{ opacity: 0, x: 300, scale: 2 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  onClick={connector.onClick}
                >
                  <img
                    src={connector.image}
                    className="max-h-6 max-w-6 group-hover:grayscale-0 grayscale opacity-60 group-hover:opacity-100 transition-all duration-200"
                  />
                  <div className="text-sm uppercase font-light">
                    {connector.name}
                  </div>
                </motion.div>
              ))}
            </div>

            <h2 className="mb-3 font-light text-xs uppercase mt-5">
              Bases de datos
            </h2>
            <div className="flex flex-wrap gap-3">
              {connectorsDb.map((connector: any, index: number) => (
                <motion.div
                  className=" flex items-center py-3 px-5 gap-3 border border-neutral-200 rounded-xl group hover:bg-neutral-100 shadow-sm"
                  transition={{
                    delay: 0.1 * index,
                    duration: 0.2,
                    ease: [0, 0.71, 0.2, 1.01],
                  }}
                  initial={{ opacity: 0, x: 300, scale: 2 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  onClick={() => {
                    connector.onClick();
                  }}
                >
                  <img
                    src={connector.image}
                    className="max-h-6 max-w-6 group-hover:grayscale-0 grayscale opacity-60 group-hover:opacity-100 transition-all duration-200"
                  />
                  <div className="text-sm uppercase font-light">
                    {connector.name}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-5 block font-light text-xs  border-t border-neutral-200 text-neutral-400 pt-3">
              * Nos conectamos a tus proveedores para sincronizar tus datos
            </div>
          </>
        )}
      </div>
    </div>
  );
}
