import { withAdmin } from "@/lib/withUser";
import { NextResponse } from "next/server";
import db from "@/db/conn";

const { User, UserPermission } = db;

export const POST = withAdmin(async function ({ user, body }: any) {
  const result = await User.findOne({
    where: {
      id: body.data.userId,
      businessId: user.businessId,
    },
  });

  let permissionsDb = await UserPermission.findAll({
    where: {
      userId: result.id,
    },
  });
  let permissions = permissionsDb.reduce((acc: any, permission: any) => {
    acc[permission.viewId] = true;
    return acc;
  }, {});

  const userMap = {
    id: result.id,
    name: result.name,
    email: result.email,
    rol: result.rol,
    permissions,
    extra1: result.extra1,
    extra2: result.extr2,
    extra3: result.extra3,
  };

  return NextResponse.json({
    data: {
      User: userMap,
    },
  });
});
