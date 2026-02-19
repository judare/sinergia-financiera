"use client";
import { useState, useEffect, useRef } from "react";
import { fetchKeys } from "@/app/services/keys";
import { useApi } from "@/app/hooks/useApi";
import { motion } from "framer-motion";
import NoItems from "@/core/components/DS/NoItems";
import { useRouter } from "next/navigation";

export default function Developers() {
  const [keys, setKeys]: any = useState([]);
  const { callApi, responded } = useApi(fetchKeys);
  const router = useRouter();

  const fetKeys = () => {
    callApi().then((result) => {
      setKeys(result.Keys);
    });
  };

  useEffect(() => {
    fetKeys();
  }, []);

  if (!responded) return;

  if (keys.length == 0)
    return (
      <NoItems
        title="No hay ningún API Key"
        description="Actualmente no tienes ningún API Key"
      />
    );

  return (
    <div className="flex-col flex bg-transparent text-neutral-700 cursor-default  divide-y divide-neutral-200">
      {keys.map((key: any, index: number) => (
        <motion.div
          key={key.id}
          className="flex items-center gap-3 py-3 "
          onClick={() => {
            // router.push(`/dashboard/developers/${key.id}`);
          }}
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: 0.1 * index,
            duration: 0.2,
            ease: [0, 0.71, 0.2, 1.01],
          }}
        >
          <div className="flex items-center gap-5">
            <div>{key.name}</div>
            <div className="text-sm text-neutral-500 font-light">
              {key.publicKey}
            </div>
          </div>
          <div className="text-xs font-light text-neutral-500 ml-auto">
            {key.privateKey}
          </div>

          {key.expiresAt && (
            <div className="text-xs font-light text-neutral-500">
              Fecha expiración {key.expiresAt}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
