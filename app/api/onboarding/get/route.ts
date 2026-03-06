import { withUser } from "@/lib/withUser";
import { sendData, sendError } from "@/lib/response";
import db from "@/db/conn";
import moment from "moment";

const {
  OnboardingProcess,
  Area,
  User,
  Position,
  TrainingPlan,
  TechnicalRequirement,
  Workstation,
  AssetsDelivery,
} = db;

export const POST = withUser(async function ({ body, user }: any) {
  const { id } = body.data;

  const responsabilities = new Set();
  let areas = await Area.findAll({
    where: {
      directorId: user.id,
    },
  });
  areas.forEach((a: any) => {
    if (!a.responsability) return;
    let r = a.responsability.split(",");
    r.forEach((v: any) => responsabilities.add(v));
  });

  const result = await OnboardingProcess.findOne({
    where: { id },
    include: [
      { model: User, as: "Manager", attributes: ["id", "fullName", "email"] },
      { model: Position, include: [{ model: Area }] },
      { model: TrainingPlan },
      { model: TechnicalRequirement },
      { model: Workstation },
      { model: AssetsDelivery },
    ],
  });

  if (!result) return sendError("Proceso no encontrado");

  return sendData({
    responsabilities: Array.from(responsabilities),
    OnboardingProcess: {
      id: result.id,
      processCode: result.processCode,
      fullName: result.fullName,
      documentType: result.documentType,
      documentNumber: result.documentNumber,
      position: result.Position?.name || null,
      suggestionCourses:
        result.Position?.suggestionCourses?.split(",")?.map((x: any) => +x) ||
        [],
      area: result.Position?.Area?.name || null,
      startDate: moment(result.startDate).format("DD/MM/YY"),
      manager: result.Manager?.fullName || null,
      status: result.status,
      trainingPlans: result.TrainingPlans || [],
      technicalRequirement: result.TechnicalRequirement || null,
      workstation: result.Workstation || null,
      assetsDeliveries: result.AssetsDeliveries || [],
    },
  });
});
