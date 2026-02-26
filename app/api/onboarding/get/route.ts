import { withUser } from "@/lib/withUser";
import { NextResponse } from "next/server";
import db from "@/db/conn";
import moment from "moment";

const { OnboardingProcess, Area, User } = db;

export const POST = withUser(async function ({}: any) {
  const result = await OnboardingProcess.findOne({
    include: [
      { model: Area },
      { model: User, as: "Manager", attributes: ["id", "fullName", "email"] },
    ],
    where: {
      processCode: 1,
    },
  });

  return NextResponse.json({
    data: {
      OnboardingProcess: {
        id: result.id,
        processCode: result.processCode,
        fullName: result.fullName,
        documentType: result.documentType,
        documentNumber: result.documentNumber,
        position: result.position,
        area: result.Area?.name || null,
        startDate: moment(result.startDate).format("DD/MM/YY"),
        manager: result.Manager?.fullName || null,
        status: result.status,
      },
    },
  });
});
