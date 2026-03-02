import { withUser } from "@/lib/withUser";
import { NextResponse } from "next/server";
import db from "@/db/conn";

const { Position } = db;

export const POST = withUser(async function ({}: any) {
  const result = await Position.findAll({
    where: {},
  });

  const list = result.map((n: any) => ({
    id: n.id,
    name: n.name,
    areaId: n.areaId,
    bossId: n.bossId,
  }));

  return NextResponse.json({
    data: {
      Positions: list,
    },
  });
});
