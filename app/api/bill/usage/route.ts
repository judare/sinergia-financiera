import { NextResponse } from "next/server";
import { withUser } from "@/lib/withUser";
import moment from "moment";
import db from "@/db/conn";

export const POST = withUser(async function ({ user, body }: any) {
  const data = body.data;

  const business = await db.Business.findOneRevalidate(
    {
      where: {
        id: user.businessId,
      },
    },
    {
      revalidationTime: 10 * 60 * 1000,
      key: `getBusiness_${user.businessId}`,
    }
  );

  const billId = data.billId || business.currentBillId;
  const bill = await db.Bill.findOneRevalidate(
    {
      where: {
        id: billId,
        businessId: user.businessId,
      },
    },
    {
      revalidationTime: 10 * 60 * 1000,
      key: `getBill_${billId}`,
    }
  );

  if (!bill) {
    return NextResponse.json({ error: "Bill not found" });
  }

  const keyAIUsageLimit = "DAILY_AI_USAGE_" + moment().format("YYYYMMDD");
  const details = await bill.getDetailsByKeys([
    "MINUTES_VOICE",
    "USERS",
    "INPUT_TOKENS",
    "OUTPUT_TOKENS",
    keyAIUsageLimit,
  ]);

  const plan = await business.getPlan();

  let minutesUsed = Math.floor(details.MINUTES_VOICE?.value || 0);

  return NextResponse.json({
    data: {
      billId: bill.id,
      billStart: bill.startBillingCycle,
      billEnd: bill.endBillingCycle,
      amount: bill.amount,
      planName: plan.label,
      aiToday: details[keyAIUsageLimit]?.value || 0,
      aiUsageLimit: business.aiUsageLimit,
      Details: details,
      includedMinutes: plan.includedMinutes,
      minutesUsed,
    },
  });
});
