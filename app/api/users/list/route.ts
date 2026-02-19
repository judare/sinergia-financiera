import moment from "moment";
import { withAdmin } from "@/lib/withUser";
import { NextResponse } from "next/server";
import db from "@/db/conn";

const { User } = db;

export const POST = withAdmin(async function ({ user }: any) {
  const result = await User.findAll({
    where: {
      businessId: user.businessId,
    },
  });

  const list = result.map((n: any) => ({
    id: n.id,
    name: n.name,
    image: n.image,
    email: n.email,
    rol: n.rol,
    lastActionAt: moment(n.lastActionAt).format("DD/MM/YY"),
  }));

  return NextResponse.json({
    data: {
      Users: list,
    },
  });
});
