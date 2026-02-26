import { withUser } from "@/lib/withUser";
import { NextResponse } from "next/server";
import db from "@/db/conn";

const { Area } = db;

export const POST = withUser(async function ({}: any) {
  const result = await Area.findAll({
    where: {},
  });

  const list = result.map((n: any) => ({
    id: n.id,
    name: n.name,
    directorId: n.directorId,
  }));

  return NextResponse.json({
    data: {
      Areas: list,
    },
  });
});
