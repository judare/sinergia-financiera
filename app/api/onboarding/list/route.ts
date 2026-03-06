import { withUser } from "@/lib/withUser";
import { NextResponse } from "next/server";
import db from "@/db/conn";
import moment from "moment";

const { OnboardingProcess, Area, User, AreaRequest, Position } = db;

export const POST = withUser(async function ({ user, body }: any) {
  let data = body.data;

  const queryBuilderOnboarding: any = {
    model: OnboardingProcess,
    required: true,
    where: {},

    include: [
      {
        include: [{ model: Area }],
        model: Position,
        required: true,
      },
      {
        model: User,
        as: "Manager",
        attributes: ["id", "fullName", "email"],
      },
    ],
  };

  if (data.filters?.status) {
    queryBuilderOnboarding.where.status = data.filters.status;
  } else {
    queryBuilderOnboarding.where.status = "pending";
  }

  if (data.filters?.positionId) {
    queryBuilderOnboarding.where.positionId = data.filters.positionId;
  }

  if (data.filters?.search) {
    queryBuilderOnboarding.where.fullName = {
      [db.Op.like]: `%${data.filters.search}%`,
    };
  }

  const queryBuilder: any = {
    include: [queryBuilderOnboarding],
    where: {
      areaId: user.areaId,
    },
    order: [["createdAt", "DESC"]],
  };

  const requests = await AreaRequest.findAll(queryBuilder);

  const list = requests.map((n: any) => ({
    id: n.OnboardingProcess.id,
    onboardingProcessId: n.OnboardingProcess.id,
    managerId: n.OnboardingProcess.managerId,
    processCode: n.OnboardingProcess.processCode,
    fullName: n.OnboardingProcess.fullName,
    documentType: n.OnboardingProcess.documentType,
    documentNumber: n.OnboardingProcess.documentNumber,
    area: n.OnboardingProcess.Position.Area?.name || null,
    startDate: moment(n.OnboardingProcess.startDate).format("YYYY-MM-DD"),
    manager: n.OnboardingProcess.Manager?.fullName || null,
    status: n.OnboardingProcess.status,
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
