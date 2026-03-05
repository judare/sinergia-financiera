import { z } from "zod";
import { withUser } from "@/lib/withUser";
import {
  isValidSchema,
  sendDataValidationError,
  sendData,
} from "@/lib/response";
import db from "@/db/conn";

const { User } = db;

const schema = z.object({
  fullName: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(4).max(100),
  areaId: z.number().int(),
});

export const POST = withUser(async function ({ body }: any) {
  const { success, errors } = await isValidSchema(schema, body.data);
  if (!success) return sendDataValidationError(errors);

  const user = await User.create({
    fullName: body.data.fullName,
    email: body.data.email,
    password: body.data.password,
    areaId: body.data.areaId,
  });

  return sendData({ id: user.id });
});
