import { NextResponse } from "next/server";
import db from "@/db/conn";
import { withUser } from "@/lib/withUser";

export const POST = withUser(async function ({ user, body }: any) {
  const bill = await db.Bill.findOne({
    where: {
      id: body.billId,
      businessId: user.businessId,
    },
  });

  const details = await bill.getDetailsByKeys([
    "BLOCK_EXECUTIONS",
    "BLOCK_TIME",
    "NETWORK_INPUT",
    "NETWORK_OUTPUT",
    "USERS",
  ]);

  return NextResponse.json({
    data: {
      Bill: {
        billId: bill.id,
        blockUsage: details.BLOCK_EXECUTIONS?.value || 0,
        Details: details,
      },
    },
  });
});
