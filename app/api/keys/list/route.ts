import { z } from "zod";
import { withAdmin } from "@/lib/withUser";
import db from "@/db/conn";
import {
  isValidSchema,
  sendDataValidationError,
  sendData,
} from "@/lib/response";
import moment from "moment";

const { Key } = db;

const schema = z.object({});

export const POST = withAdmin(async function ({ body, user }: any) {
  const data = body.data;

  const { success, errors } = await isValidSchema(schema, {
    ...data,
  });
  if (!success) return sendDataValidationError(errors);

  const keys = await Key.findAll({
    where: {
      businessId: user.businessId,
    },
  });

  const list = keys.map((n: any) => ({
    id: n.id,
    name: n.name,
    lastUseAt: n.lastUseAt
      ? moment(n.lastUseAt).format("DD/MM/YYYY HH:mm")
      : null,
    publicKey: n.publicKey,
    privateKey: n.getObfuscateKey(),
    expiresAt: n.expiresAt,
  }));

  return sendData({
    Keys: list,
  });
});
