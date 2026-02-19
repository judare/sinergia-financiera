import { useState } from "react";
import { useContext } from "use-context-selector";
import { useRouter } from "next/navigation";
import { useApi } from "@/app/hooks/useApi";
import { addAgent } from "@/app/services/agents";
import { ArrowUp } from "lucide-react";
import DS from "design-system";
import { PlaceholdersAndVanishInput } from "@/app/components/magicui/input-vanish";
import { motion } from "framer-motion";
import { Context } from "@/app/providers/Session";

const CreateNewAgent = ({ workspace, agents }: any) => {
  const { business }: any = useContext(Context);
  const { loading, callApi: callApiAdd } = useApi(addAgent);
  const router = useRouter();
  const [form, setForm]: any = useState({ prompt: "" });

  const website = business?.website
    ? business?.website.replace("https://", "")
    : "pagina.com";

  const handleClickCreateNew = async () => {
    const response = await callApiAdd({
      workspaceId: workspace,
      prompt: form.prompt,
    });

    if (response?.Agent?.id) {
      router.push(`/dashboard/${workspace}/agents/${response.Agent.id}`);
    }
  };

  const placeholders = business?.meta?.suggestedAgents || [
    "Crear un agente de ventas para " + website,
  ];

  return (
    <motion.div
      className={`${
        agents.length == 0
          ? "h-full  flex items-center justify-center flex-col gap-5"
          : ""
      }`}
    >
      {agents.length <= 0 && (
        <h2 className="text-black text-center text-3xl mt-auto">
          Crea tu primer agente
        </h2>
      )}
      <motion.div
        className={`text-center z-20 rounded-2xl  border border-black/20 dark:border-white/10   bottom-5 w-[30rem] bg-white ${
          agents.length == 0
            ? "mx-auto  shadow-[0_0_10px_rgba(0,0,0,0.10)]"
            : "fixed left-1/2 -translate-x-1/2  shadow-[0_0_20px_rgba(0,0,0,0.20)] "
        } `}
        transition={{ duration: 0.3, ease: [0, 0.71, 0.2, 1.01] }}
        initial={{
          opacity: 0,
          y: agents.length == 0 ? -300 : 0,
          transform: agents.length > 0 ? "translateX(-50%)" : undefined,
        }}
        animate={{ opacity: 1, y: 0 }}
        key={agents.length}
      >
        <div className="rounded-2xl  w-full overflow-hidden relative select-none text-black ">
          <PlaceholdersAndVanishInput
            defaultValue={form.prompt}
            onChange={(val: any) => {
              setForm({ ...form, prompt: val.target.value });
            }}
            placeholders={placeholders}
          />

          <div
            className={`rounded-full size-9 z-[60] absolute right-3 bottom-3 flex items-center justify-center transition-all duration-200 ${
              form.prompt?.trim()
                ? "bg-black text-white"
                : "bg-neutral-200 text-neutral-400"
            }`}
            onClick={handleClickCreateNew}
          >
            {loading && <DS.Loader size="sm" />}
            {!loading && (
              <ArrowUp strokeWidth={3} className="size-5 font-bold" />
            )}
          </div>
        </div>
      </motion.div>

      {agents.length <= 0 && (
        <span className="text-neutral-500 text-center text-sm mt-auto py-3">
          Un agente es una inteligencia artificial que realiza una tarea via
          llamada telefonica
        </span>
      )}
    </motion.div>
  );
};

export default CreateNewAgent;
