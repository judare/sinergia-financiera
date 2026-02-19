"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "@/app/hooks/useSession";
import { useRouter } from "next/navigation";
import { fetchAgents } from "@/app/services/agents";
import AddCreditCard from "@/app/components/UI/AddCreditCard";
import { useApi } from "@/app/hooks/useApi";
import { motion } from "framer-motion";
import { AudioPlayer } from "@/app/components/UI/AgentDemo";
import Status from "@/app/components/UI/Status";
import CreateNewAgent from "./CreateNewAgent";

export default function ListAgents({ workspace }: any) {
  const { data: session }: any = useSession();
  const isAdmin = session?.user?.rol == "admin";
  const [agents, setAgents] = useState([]);
  const { callApi, responded } = useApi(fetchAgents);

  const router = useRouter();

  useEffect(() => {
    listAgents();
  }, []);

  const listAgents = async () => {
    const result = await callApi(workspace);
    setAgents(result.Agents);
  };

  const onLimit = () => {
    if (session?.business?.addedCard) return false;
    if (agents.length <= 0) return false;
    return agents.length >= session?.business?.limitAgents;
  };

  const canCreateAgents = () => {
    return isAdmin && !onLimit();
  };

  if (!responded) return;

  return (
    <>
      <CreateNewAgent
        agents={agents}
        business={session?.business}
        workspace={workspace}
      />

      <div className="lg:px-5">
        {!canCreateAgents() && !session?.business?.addedCard && (
          <div className="mb-5 ">
            <AddCreditCard text="You need to add a credit card to continue building" />
          </div>
        )}

        {agents.length > 0 && (
          <ul className="flex flex-col gap-3 lg:gap-3 text-black mb-auto pb-20 ">
            {agents.map((agent: any, index: number) => (
              <motion.li
                key={agent.id}
                className=" border border-neutral-200 shadow-sm rounded-xl px-5 py-4 hover:shadow-[0_0px_35px_rgba(0,0,0,0.15)] transition-all duration-100 ease-in-out cursor-pointer"
                onClick={() =>
                  router.push(`/dashboard/${workspace}/agents/${agent.id}`)
                }
                transition={{
                  delay: 0.1 * index,
                  duration: 0.4,
                  ease: [0, 0.71, 0.2, 1.01],
                }}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="">{agent.label}</div>

                <div className="flex justify-between items-center gap-2 mt-3">
                  {agent.Voice && (
                    <AudioPlayer
                      src={agent.Voice.audio}
                      voiceId={agent.id}
                      voiceName={"Voz de " + agent.Voice.name}
                    />
                  )}

                  <div className="text-xs text-neutral-500">
                    {agent.calls} llamadas
                  </div>

                  <Status status={agent.status} />
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
