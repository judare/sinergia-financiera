import { withUser } from "@/lib/withUser";
import { NextResponse } from "next/server";
import db from "@/db/conn";
import moment from "moment";

const { OnboardingProcess, Area, User } = db;

export const POST = withUser(async function ({ user }: any) {
  const result = await OnboardingProcess.findAll({
    include: [
      { model: Area },
      { model: User, as: "Manager", attributes: ["id", "fullName", "email"] },
    ],
    order: [["createdAt", "DESC"]],
  });

  const list = result.map((n: any) => ({
    id: n.id,
    processCode: n.processCode,
    fullName: n.fullName,
    documentType: n.documentType,
    documentNumber: n.documentNumber,
    position: n.position,
    area: n.Area?.name || null,
    startDate: moment(n.startDate).format("DD/MM/YY"),
    manager: n.Manager?.fullName || null,
    status: n.status,
  }));

  return NextResponse.json({
    data: {
      OnboardingProcesses: list,
    },
  });
});
