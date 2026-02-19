import { NextResponse } from "next/server";
import db from "@/db/conn";
import { withUser } from "@/lib/withUser";

const { Workspace } = db;

export const POST = withUser(async function ({ body, user }: any) {
  let queryBuilder = {
    attributes: ["id", "name", "slug", "datasources", "urlScript"],
    where: {
      businessId: user.businessId,
    },
  };
  let result = await Workspace.findAll(queryBuilder);

  let list = result.map((w: any) => ({
    id: w.id,
    name: w.name,
    slug: w.slug,
    datasources: w.datasources,
  }));
  let current = result.find((w: any) => w.id == body.data.workspaceId);

  if (current) {
    current = {
      id: "" + current.id,
      name: current.name,
      slug: current.slug,
      datasources: current.datasources,
    };
  }

  return NextResponse.json({
    data: {
      CurrentWorkspace: current || null,
      Workspaces: list,
    },
  });
});
