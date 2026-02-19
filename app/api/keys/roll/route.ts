import { z } from "zod";
import { withAdmin } from "@/lib/withUser";
import db from "@/db/conn";
import {
  isValidSchema,
  sendDataValidationError,
  sendData,
} from "@/lib/response";

const { Workspace, Key } = db;

const schema = z.object({
  workspaceId: z.string().refine(async (e: string) => {
    const workspace = await Workspace.findById(e);
    return workspace;
  }, "The workspace doesn't exists."),
});

export const POST = withAdmin(async function ({ body, user }: any) {
  const data = body.data;

  const { success, errors } = await isValidSchema(schema, {
    ...data,
  });
  if (!success) return sendDataValidationError(errors);

  let workspace = await Workspace.findOne({
    where: {
      businessId: user.businessId,
      id: data.workspaceId,
    },
  });

  if (data.expireCurrentsAt) {
    data.expireCurrentsAt = +data.expireCurrentsAt;
    let keys = await Key.getActiveKeys(workspace.id);
    keys = keys.filter((x: any) => !x.isDefault);
    for (let k of keys) {
      await k.update({
        expiresAt: Date.now() + data.expireCurrentsAt,
      });
    }
  }

  const key = await Key.createNew(workspace.id, user.businessId, false);

  return sendData({
    Key: {
      id: workspace.id,
      key: key.id,
      privateKey: key.privateKey,
    },
  });
});
