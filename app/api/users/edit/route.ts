import { withAdmin } from "@/lib/withUser";
import { NextResponse } from "next/server";
import db from "@/db/conn";

const { User, UserPermission, View } = db;

export const POST = withAdmin(async function ({ user, body }: any) {
  let permissions = body.data.permissions;

  const userToEdit = await User.findOne({
    where: {
      id: body.data.userId,
      businessId: user.businessId,
    },
  });

  await userToEdit.update({
    rol: body.data.rol,
    name: body.data.name,
    extra1: body.data.extra1,
    extra2: body.data.extra2,
    extra3: body.data.extra3,
  });

  // clear all the permissions
  await UserPermission.destroy({
    where: {
      userId: userToEdit.id,
    },
  });

  const viewIds = Object.keys(permissions).filter((v) => permissions[v]);
  let queryBuilder = {
    where: {
      id: { [db.Op.in]: viewIds },
      businessId: user.businessId,
    },
  };
  let views = await View.findAll(queryBuilder);

  let bulkCreate = [];
  for (let view of views) {
    bulkCreate.push({
      viewId: view.id,
      userId: userToEdit.id,
    });
  }
  if (bulkCreate.length > 0) {
    await UserPermission.bulkCreate(bulkCreate);
  }

  return NextResponse.json({
    data: {},
  });
});
