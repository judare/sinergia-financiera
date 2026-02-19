import { withAdmin } from "@/lib/withUser";
import { NextResponse } from "next/server";
import db from "@/db/conn";

const { User } = db;

export const POST = withAdmin(async function ({ user, body }: any) {
  const userToDelete = await User.findOne({
    where: {
      businessId: user.businessId,
      [db.Op.and]: [{ id: body.data.userId }, { id: { [db.Op.not]: user.id } }],
    },
  });

  await userToDelete.destroy();

  return NextResponse.json({
    data: {},
  });
});
