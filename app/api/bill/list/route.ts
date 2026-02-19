import { NextResponse } from "next/server";
import { withUser } from "@/lib/withUser";
import db from "@/db/conn";

export const POST = withUser(async function ({ user }: any) {
  const business = await db.Business.findOne({
    where: {
      id: user.businessId,
    },
  });

  const bills = await db.Bill.findAll({
    where: {
      businessId: user.businessId,
    },
    order: [["startBillingCycle", "DESC"]],
  });

  let rows = bills.map((bill: any) => ({
    isCurrent: bill.id == business.currentBillId,
    id: bill.id,
    startBillingCycle: bill.startBillingCycle,
    endBillingCycle: bill.endBillingCycle,
    amount: bill.amount,
    paid: bill.paid,
    number: bill.number,
  }));

  return NextResponse.json({
    data: {
      Bills: rows,
    },
  });
});
