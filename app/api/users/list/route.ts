import moment from "moment";
import { withUser } from "@/lib/withUser";
import { NextResponse } from "next/server";
import db from "@/db/conn";

const { User, Area, Role } = db;

export const POST = withUser(async function ({ user }: any) {
  const result = await User.findAll({
    include: [
      {
        model: Area,
        required: true,
      },
      {
        model: Role,
        required: true,
      },
    ],
    where: {},
  });

  const list = result.map((n: any) => ({
    id: n.id,
    fullName: n.fullName,
    email: n.email,
    rol: n.rol,
    lastActionAt: moment(n.lastActionAt).format("DD/MM/YY"),
    Role: {
      id: n.Role.id,
      name: n.Role.name,
    },
    Area: {
      id: n.Area.id,
      name: n.Area.name,
    },
  }));

  return NextResponse.json({
    data: {
      Users: list,
    },
  });
});
