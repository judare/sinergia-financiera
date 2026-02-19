import { withUser } from "@/lib/withUser";
import { NextResponse } from "next/server";
import db from "@/db/conn";
import Wompi from "@/app/services/wompi";

const { Business, PaymentMethod } = db;

export const POST = withUser(async function ({ user, body }: any) {
  let data = body.data;

  /*
    We don't save your credit cards in our database. Instead, we tokenize your cards using an external service, and we only send the token.
  */
  let wompi = new Wompi();
  const { id } = await wompi.createPaymentSource(data.token, user.email);

  const paymentMethod = await PaymentMethod.create({
    name: data.lastFour,
    brand: data.brand,
    lastUseAt: new Date(),
    expiryMonth: data.expiryMonth,
    expiryYear: data.expiryYear,
    businessId: user.businessId,
    paymentProviderToken: id,
    verified: 1,
  });

  let business = await Business.findOne({ where: { id: user.businessId } });

  await business.update({
    paymentMethodId: paymentMethod.id,
  });

  return NextResponse.json({
    data: {},
  });
});
