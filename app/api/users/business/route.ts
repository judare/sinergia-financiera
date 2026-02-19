import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/withUser";
import db from "@/db/conn";

const { Business } = db;

export const POST = withAdmin(async function ({ user }: any) {
  const business = await Business.findOne({
    where: {
      id: user.businessId,
    },
  });

  return NextResponse.json({
    data: {
      Business: {
        id: business.id,
        name: business.name,
        logo: business.logo,
        countryId: business.countryId,
        address: business.address,
        city: business.city,
        vatType: business.vatType,
        vatNumber: business.vatNumber,
        website: business.website,
        billEmail: business.billEmail,
        meta: business.meta,
        context: business.context,
        onboarding: business.onboarding,
        hasToPay: await business.hasToPay(),
        addedCard: !!business.paymentProviderToken,
        limitViews: !business.paymentProviderToken ? 5 : null,
        limitUsers: !business.paymentProviderToken ? 2 : null,
      },
    },
  });
});
