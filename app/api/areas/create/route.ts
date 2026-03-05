import { withUser } from "@/lib/withUser";
import { sendData, sendError } from "@/lib/response";
import db from "@/db/conn";

const { Area } = db;

export const POST = withUser(async function ({ body }: any) {
  const { name, directorId } = body.data;

  if (!name || !directorId) {
    return sendError("Nombre y director son requeridos");
  }

  const area = await Area.create({ name, directorId });

  return sendData({ area });
});
