import { NextResponse } from "next/server";
import db from "@/db/conn";

const { Plan } = db;

export const POST = async () => {
  const plans = await Plan.findAll({
    where: {
      isPublic: true,
    },
    order: [["price", "ASC"]],
  });

  let rows = plans.map((plan: any) => ({
    id: plan.id,
    label: plan.label,
    includedMinutes: plan.includedMinutes,
    price: plan.price,
    priceExtraMinute: plan.priceExtraMinute,
    limitDatasources: plan.limitDatasources,
    limitCustomers: plan.limitCustomers,
    retentionDays: plan.retentionDays,
    pricePerAgent: plan.pricePerAgent,
    includedAgents: plan.includedAgents,
    priceYearly: plan.priceYearly,
  }));

  return NextResponse.json({
    data: {
      Plans: rows,
    },
  });
};
