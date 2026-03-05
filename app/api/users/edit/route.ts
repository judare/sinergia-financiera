import { withUser } from "@/lib/withUser";
import { sendData } from "@/lib/response";
import db from "@/db/conn";

const { User } = db;

export const POST = withUser(async function ({ body }: any) {
  const userToEdit = await User.findByPk(body.data.userId);

  await userToEdit.update({
    fullName: body.data.fullName,
    areaId: body.data.areaId,
  });

  return sendData({});
});
