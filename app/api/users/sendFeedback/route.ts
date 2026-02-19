import { z } from "zod";
import { withUser } from "@/lib/withUser";
import db from "@/db/conn";
import {
  isValidSchema,
  sendDataValidationError,
  sendData,
} from "@/lib/response";

const { Feedback } = db;

const schema = z.object({
  feedback: z.string().min(3).max(1000),
});

export const POST = withUser(async function ({ user, body }: any) {
  const data = body.data;

  const { success, errors } = await isValidSchema(schema, {
    ...data,
  });
  if (!success) return sendDataValidationError(errors);

  await Feedback.create({
    businessId: user.businessId,
    feedback: data.feedback,
    userId: user.id,
  });
  return sendData({});
});
