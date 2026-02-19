import { NextResponse } from "next/server";
import { withUser } from "@/lib/withUser";
import db from "@/db/conn";

export const POST = withUser(async function ({ user, body }: any) {
  const data = body.data;
  const { paymentMethodId } = data;

  const business = await db.Business.findOne({
    where: {
      id: user.businessId,
    },
  });

  const paymentMethod = await db.PaymentMethod.findOne({
    where: {
      businessId: user.businessId,
      id: paymentMethodId,
    },
  });

  // remove previous default

  await business.update({
    paymentMethodId: paymentMethod.id,
  });

  return NextResponse.json({
    data: {},
  });
});
