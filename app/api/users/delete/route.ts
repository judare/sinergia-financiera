import { withUser } from "@/lib/withUser";
import { sendData } from "@/lib/response";
import db from "@/db/conn";

const { User } = db;

export const POST = withUser(async function ({ body }: any) {
  const userToDelete = await User.findByPk(body.data.userId);
  await userToDelete.destroy(); // paranoid: true → sets deletedAt
  return sendData({});
});
