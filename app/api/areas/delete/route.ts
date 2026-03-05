import { withUser } from "@/lib/withUser";
import { sendData, sendError } from "@/lib/response";
import db from "@/db/conn";

const { Area } = db;

export const POST = withUser(async function ({ body }: any) {
  const { areaId } = body.data;

  if (!areaId) {
    return sendError("areaId es requerido");
  }

  const area = await Area.findByPk(areaId);
  if (!area) {
    return sendError("Área no encontrada");
  }

  await area.destroy();

  return sendData({ message: "Área eliminada correctamente" });
});
