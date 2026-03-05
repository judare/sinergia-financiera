import { withUser } from "@/lib/withUser";
import { sendData } from "@/lib/response";
import db from "@/db/conn";

const { Area, User } = db;

export const POST = withUser(async function ({}: any) {
  const areas = await Area.findAll({
    include: [{ model: User, as: "User", attributes: ["id", "fullName", "email"] }],
    order: [["id", "ASC"]],
  });

  return sendData({ Areas: areas });
});
