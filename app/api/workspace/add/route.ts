import { z } from "zod";
import { withUser } from "@/lib/withUser";
import db from "@/db/conn";
import {
  isValidSchema,
  sendDataValidationError,
  sendData,
} from "@/lib/response";

const { Workspace, Key } = db;

const schema = z.object({
  name: z.string().min(3),
});

export const POST = withUser(async function ({ body, user }: any) {
  const data = body.data;

  const { success, errors } = await isValidSchema(schema, {
    ...data,
  });
  if (!success) return sendDataValidationError(errors);

  let dataCreation: any = {
    businessId: user.businessId,
    name: data.name,
    slug: data.name,
  };

  let workspace = await Workspace.create(dataCreation);

  const key = await Key.createNew(workspace.id, user.businessId, true);

  return sendData({
    Workspace: {
      id: workspace.id,
      key: key.id,
      slug: workspace.id,
    },
  });
});
