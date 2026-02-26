import { withUser } from "@/lib/withUser";
import { NextResponse } from "next/server";
import db from "@/db/conn";
import moment from "moment";

const { OnboardingProcess } = db;

export const POST = withUser(async function ({ user, body }: any) {
  let data = body.data;
  await OnboardingProcess.create({
    processCode: data.processCode,
    fullName: data.fullName,
    documentType: data.fullName,
    documentNumber: data.fullName,
    position: data.fullName,
    areaId: 1,
    startDate: moment(data.startDate).toDate(),
    managerId: user.id,
    status: "Pendiente",
  });

  return NextResponse.json({
    data: {},
  });
});
