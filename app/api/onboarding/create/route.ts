import { withUser } from "@/lib/withUser";
import { NextResponse } from "next/server";
import db from "@/db/conn";
import moment from "moment";
import Email from "@/app/services/mail";
import OnboardingCreated from "@/emails/OnboardingCreated";

const { OnboardingProcess, Area, AreaRequest, User, Position } = db;

export const POST = withUser(async function ({ user, body }: any) {
  let data = body.data;

  const position = await Position.findOne({
    where: { id: data.positionId },
    include: [
      {
        model: Area,
      },
    ],
  });

  const responsabilities = position.Area.responsabilities.split(",");

  let onboarding = await OnboardingProcess.create({
    processCode: data.processCode,
    fullName: data.fullName,
    documentType: data.documentType,
    documentNumber: data.documentNumber,
    positionId: data.positionId,
    startDate: moment(data.startDate).toDate(),
    managerId: user.id,
    status: "pending",
  });

  let areas = await Area.findAll({
    include: [
      {
        model: User,
      },
    ],
    where: {},
  });

  areas = areas.filter((a: any) => {
    if (!a.responsability) return false;
    const areaResponsability = a.responsability.split(",");
    return responsabilities.some((r: any) => areaResponsability.includes(r));
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

    if (area.User?.email) {
      console.log(area, area.User?.email);
      console.log(OnboardingCreated);
      emailSender.send(
        area.User.email,
        "Nuevo proceso de onboarding",
        OnboardingCreated,
        {
          onboarding,
        },
      );
    }
  }

  await AreaRequest.bulkCreate(toInsertRequests);

  return NextResponse.json({
    data: {},
  });
});
