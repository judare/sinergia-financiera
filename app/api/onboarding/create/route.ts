import { withUser } from "@/lib/withUser";
import { NextResponse } from "next/server";
import db from "@/db/conn";
import moment from "moment";
import Email from "@/app/services/mail";
import OnboardingCreated from "@/emails/OnboardingCreated";

const { OnboardingProcess, Area, AreaRequest, User } = db;

export const POST = withUser(async function ({ user, body }: any) {
  let data = body.data;

  const areas = await Area.findAll({
    include: [
      {
        model: User,
        as: "director",
      },
    ],
    where: {},
  });
  let onboarding = await OnboardingProcess.create({
    processCode: data.processCode,
    fullName: data.fullName,
    documentType: data.documentType,
    documentNumber: data.documentNumber,
    positionId: data.positionId,
    areaId: data.areaId,
    startDate: moment(data.startDate).toDate(),
    managerId: user.id,
    status: "pending",
  });

  let toInsertRequests = [];
  let emailSender = new Email();
  for (let area of areas) {
    toInsertRequests.push({
      onboardingProcessId: onboarding.id,
      areaId: area.id,
      status: "pending",
      deadline: moment().add(1, "month").format("YYYY-MM-DD"),
    });

    emailSender.send(
      area.director.email,
      "Nuevo proceso de onboarding",
      OnboardingCreated,
      {
        onboarding,
      },
    );
  }

  await AreaRequest.bulkCreate(toInsertRequests);

  return NextResponse.json({
    data: {},
  });
});
