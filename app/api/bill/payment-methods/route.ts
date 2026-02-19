import { NextResponse } from "next/server";
import { withUser } from "@/lib/withUser";
import moment from "moment";
import db from "@/db/conn";

export const POST = withUser(async function ({ user }: any) {
  const business = await db.Business.findOne({
    where: {
      id: user.businessId,
    },
  });

  const paymentMethods = await db.PaymentMethod.findAll({
    where: {
      businessId: user.businessId,
    },
  });

  let rows = paymentMethods.map((pm: any) => ({
    id: pm.id,
    verified: pm.verified,
    description: pm.description,
    lastUseAt: moment(pm.lastUseAt).format("DD/MM/YYYY"),
    name: pm.name,
    brand: pm.brand,
    expiryMonth: pm.expiryMonth,
    expiryYear: pm.expiryYear,
    isDefault: business.paymentMethodId == pm.id,
  }));

  return NextResponse.json({
    data: {
      PaymentMethods: rows,
    },
  });
});
