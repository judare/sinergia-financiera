import { withUser } from "@/lib/withUser";
import { NextResponse } from "next/server";
import db from "@/db/conn";
import moment from "moment";

const { OnboardingProcess, Area, User, AreaRequest } = db;

export const POST = withUser(async function ({ user }: any) {
  const requests = await AreaRequest.findAll({
    include: [
      {
        model: OnboardingProcess,
        required: true,

        include: [
          { model: Area },
          {
            model: User,
            as: "Manager",
            attributes: ["id", "fullName", "email"],
          },
        ],
        where: {
          managerId: user.id,
        },
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  const list = requests.map((n: any) => ({
    id: n.id,
    processCode: n.OnboardingProcess.processCode,
    fullName: n.OnboardingProcess.fullName,
    documentType: n.OnboardingProcess.documentType,
    documentNumber: n.OnboardingProcess.documentNumber,
    position: n.OnboardingProcess.position,
    area: n.OnboardingProcess.Area?.name || null,
    startDate: moment(n.OnboardingProcess.startDate).format("DD/MM/YY"),
    manager: n.OnboardingProcess.Manager?.fullName || null,
    status: n.OnboardingProcess.status,
  }));

  return NextResponse.json({
    data: {
      OnboardingProcesses: list,
    },
  });
});
