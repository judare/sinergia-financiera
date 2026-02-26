import { withUser } from "@/lib/withUser";
import { NextResponse } from "next/server";
import db from "@/db/conn";

const { Course } = db;

export const POST = withUser(async function ({}: any) {
  const result = await Course.findAll({
    where: {},
  });

  const list = result.map((n: any) => ({
    id: n.id,
    name: n.name,
    observation: n.observation,
    mode: n.mode,
  }));

  return NextResponse.json({
    data: {
      Courses: list,
    },
  });
});
