import { NextResponse } from "next/server";
import { withUser } from "@/lib/withUser";
import db from "@/db/conn";

export const POST = withUser(async function ({ user, body }: any) {
  const data = body.data;
  const business = await db.Business.findOne({
    where: {
      id: user.businessId,
    },
  });
  const bill = await business.getBill();

  if (!bill) {
    return NextResponse.json({ error: "Bill not found" });
  }

  const includeBlocks: any = {
    attributes: ["id", "description", "key", "folder", "workspaceId"],
    model: db.Block,
    required: true,
    where: {},
  };

  if (data.workspaceId) {
    includeBlocks.where.workspaceId = data.workspaceId;
  }

  let queryBuilder: any = {
    include: [includeBlocks],
    where: {
      businessId: user.businessId,
    },
  };

  if (data.dateStart && data.dateEnd) {
    queryBuilder.where.date = {
      [db.Op.between]: [data.dateStart, data.dateEnd],
    };
  } else if (data.dateStart) {
    queryBuilder.where.date = {
      [db.Op.gte]: data.dateStart,
    };
  } else if (data.dateEnd) {
    queryBuilder.where.date = {
      [db.Op.lte]: data.dateEnd,
    };
  } else {
    queryBuilder.where.date = {
      [db.Op.gt]: Date.now() - 1000 * 60 * 60 * 24 * 30,
    };
  }

  const details = await db.BlockExecutionSummary.findAll(queryBuilder);

  const mapped = details.reduce((acc: any, item: any) => {
    if (!acc[item.blockId]) {
      acc[item.blockId] = {
        blockId: item.Block.blockId,
        key: item.Block.key,
        folder: item.Block.folder,
        description: item.Block.description,
        workspaceId: item.Block.workspaceId,
        cpuTime: 0,
        inputSize: 0,
        outputSize: 0,
        quantity: 0,
        errors: 0,
        data: [],
      };
    }
    acc[item.blockId].cpuTime += item.cpuTime;
    acc[item.blockId].inputSize += item.inputSize;
    acc[item.blockId].outputSize += item.outputSize;
    acc[item.blockId].quantity += item.quantity - item.errors;
    acc[item.blockId].errors += item.errors;
    acc[item.blockId].data.push({
      cpuTime: item.cpuTime,
      inputSize: item.inputSize,
      outputSize: item.outputSize,
      quantity: item.quantity,
      errors: item.errors,
    });
    return acc;
  }, {});

  return NextResponse.json({
    data: {
      Details: Object.values(mapped),
    },
  });
});
