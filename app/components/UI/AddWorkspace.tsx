import { useState } from "react";
import DS from "design-system";
import { Context } from "@/app/providers/Workspace";
import { useRouter } from "next/navigation";
import { PlusCircle, X } from "lucide-react";
import { useContextSelector } from "use-context-selector";

export default function AddWorkspace() {
  const currentWorkspace = useContextSelector(
    Context,
    (a) => a.currentWorkspace,
  );
  const [show, setShow] = useState(true);
  const router = useRouter();
  if (currentWorkspace.datasources > 0) return null;
  if (!show) return null;
  return (
    <div className="top-0 left-0 absolute w-full h-full z-20 backdrop-blur-lg bg-neutral-100/60 border border-neutral-300 p-5 rounded-lg flex items-center justify-center dark:bg-neutral-800/60 dark:border-black">
      <div>
        <div className="text-center text-2xl">
          Probably you need to add a datasource to this workspace
        </div>
        <div className="flex justify-center gap-3 mt-5">
          <DS.Button
            text="Close and continue"
            onClick={() => {
              setShow(false);
            }}
            icon={X}
            variant="secondary"
            size="sm"
          />
          <DS.Button
            text="Add datasource"
            onClick={() => {
              router.push(`/dashboard/${currentWorkspace.id}/settings`);
            }}
            icon={PlusCircle}
            variant="primary"
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}
