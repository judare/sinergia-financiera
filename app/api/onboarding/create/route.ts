import { withUser } from "@/lib/withUser";
import { NextResponse } from "next/server";
import db from "@/db/conn";
import moment from "moment";

const { OnboardingProcess, Area, AreaRequest } = db;

export const POST = withUser(async function ({ user, body }: any) {
  let data = body.data;

  const areas = await Area.findAll({
    where: {},
  });
  let onboarding = await OnboardingProcess.create({
    processCode: data.processCode,
    fullName: data.fullName,
    documentType: data.documentType,
    documentNumber: data.documentNumber,
    position: data.position,
    areaId: data.areaId,
    startDate: moment(data.startDate).toDate(),
    managerId: user.id,
    status: "Pendiente",
  });

  let toInsertRequests = [];
  for (let area of areas) {
    toInsertRequests.push({
      onboardingProcessId: onboarding.id,
      areaId: area.id,
      status: "Pendiente",
      deadline: moment().add(1, "month").format("YYYY-MM-DD"),
    });
  }

  await AreaRequest.bulkCreate(toInsertRequests);

  return NextResponse.json({
    data: {},
  });
});
