import { NextResponse } from "next/server";
import { withUser } from "@/lib/withUser";
import db from "@/db/conn";

export const POST = withUser(async function ({ user, body }: any) {
  const data = body.data;
  const { paymentMethodId } = data;

  const paymentMethod = await db.PaymentMethod.findOne({
    where: {
      businessId: user.businessId,
      id: paymentMethodId,
    },
    logging: console.log,
  });

  await paymentMethod.destroy();

  return NextResponse.json({
    data: {},
  });
});
