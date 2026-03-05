import { withUser } from "@/lib/withUser";
import { sendData, sendError } from "@/lib/response";
import db from "@/db/conn";

const { OnboardingProcess, TrainingPlan, TechnicalRequirement, Workstation, AssetsDelivery } = db;

export const POST = withUser(async function ({ body }: any) {
  const {
    id,
    fullName,
    documentType,
    documentNumber,
    positionId,
    areaId,
    startDate,
    status,
    trainingPlan,
    workstation,
    assetsDelivery,
    technicalRequirement,
  } = body.data;

  const onboarding = await OnboardingProcess.findByPk(id);
  if (!onboarding) return sendError("Proceso no encontrado");

  const updateFields: any = {};
  if (fullName !== undefined) updateFields.fullName = fullName;
  if (documentType !== undefined) updateFields.documentType = documentType;
  if (documentNumber !== undefined) updateFields.documentNumber = documentNumber;
  if (positionId !== undefined) updateFields.positionId = positionId;
  if (areaId !== undefined) updateFields.areaId = areaId;
  if (startDate !== undefined) updateFields.startDate = startDate;
  if (status !== undefined) updateFields.status = status;
  if (Object.keys(updateFields).length > 0) {
    await onboarding.update(updateFields);
  }

  if (trainingPlan !== undefined) {
    await TrainingPlan.destroy({ where: { onboardingProcessId: id }, force: true });
    if (trainingPlan.length > 0) {
      await TrainingPlan.bulkCreate(
        trainingPlan.map((tp: any) => ({
          onboardingProcessId: id,
          courseId: tp.courseId,
          description: tp.description || null,
        }))
      );
    }
  }

  if (workstation !== undefined) {
    await Workstation.update(
      { onboardingProcessId: null, status: "Disponible" },
      { where: { onboardingProcessId: id } }
    );
    if (workstation?.seatCode) {
      const [ws] = await Workstation.findOrCreate({
        where: { seatCode: workstation.seatCode },
        defaults: { seatCode: workstation.seatCode, status: "Disponible" },
      });
      await ws.update({ onboardingProcessId: id, status: "Ocupado" });
    }
  }

  if (assetsDelivery !== undefined) {
    await AssetsDelivery.destroy({ where: { onboardingProcessId: id }, force: true });
    if (assetsDelivery.length > 0) {
      await AssetsDelivery.bulkCreate(
        assetsDelivery.map((ad: any) => ({
          onboardingProcessId: id,
          itemName: ad.itemName,
          serialNumber: ad.serialNumber || null,
          isDelivered: ad.isDelivered ?? false,
        }))
      );
    }
  }

  if (technicalRequirement !== undefined) {
    const existing = await TechnicalRequirement.findOne({
      where: { onboardingProcessId: id },
    });
    if (existing) {
      await existing.update(technicalRequirement);
    } else {
      await TechnicalRequirement.create({
        onboardingProcessId: id,
        ...technicalRequirement,
      });
    }
  }

  return sendData({});
});
