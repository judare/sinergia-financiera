import { withUser } from "@/lib/withUser";
import { NextResponse } from "next/server";
import db from "@/db/conn";
import moment from "moment";

const { OnboardingProcess, Area, User, AreaRequest, Position } = db;

export const POST = withUser(async function ({ user, body }: any) {
  let data = body.data;

  const queryBuilder: any = {
    include: [
      {
        model: OnboardingProcess,
        required: true,

        include: [
          { model: Area },
          {
            model: Position,
            required: true,
          },
          {
            model: User,
            as: "Manager",
            attributes: ["id", "fullName", "email"],
          },
        ],
      },
    ],
    where: {
      areaId: user.areaId,
    },
    order: [["createdAt", "DESC"]],
  };

  if (data.filters?.status) {
    queryBuilder.where.status = data.filters.status;
  } else {
    queryBuilder.where.status = "pending";
  }

  const requests = await AreaRequest.findAll(queryBuilder);

  const list = requests.map((n: any) => ({
    id: n.id,
    processCode: n.OnboardingProcess.processCode,
    fullName: n.OnboardingProcess.fullName,
    documentType: n.OnboardingProcess.documentType,
    documentNumber: n.OnboardingProcess.documentNumber,
    area: n.OnboardingProcess.Area?.name || null,
    startDate: moment(n.OnboardingProcess.startDate).format("DD/MM/YY"),
    manager: n.OnboardingProcess.Manager?.fullName || null,
    status: n.status,
    Position: {
      id: n.OnboardingProcess.Position?.id || null,
      name: n.OnboardingProcess.Position?.name || null,
    },
  }));

  return NextResponse.json({
    data: {
      OnboardingProcesses: list,
    },
  });
});
