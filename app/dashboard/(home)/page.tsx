import { getServerSession } from "@/lib/sessionServer";
import { redirect } from "next/navigation";
import db from "@/db/conn";

const { Workspace } = db;
async function getDefaultWorkspaceId() {
  const session = await getServerSession();

  let workspace = await Workspace.findOne({
    where: {
      businessId: session?.business?.id,
    },
  });
  return workspace.id;
}

export default async function Home() {
  const workspace = await getDefaultWorkspaceId();
  if (workspace) {
    redirect("/dashboard/" + workspace);
  }
}
