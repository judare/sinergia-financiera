import { withUser } from "@/lib/withUser";
import { sendData } from "@/lib/response";
import db from "@/db/conn";

const { Workstation } = db;

export const POST = withUser(async function ({}: any) {
  const result = await Workstation.findAll({
    order: [["seatCode", "ASC"]],
  });

  const list = result.map((w: any) => ({
    id: w.id,
    seatCode: w.seatCode,
    status: w.status,
    onboardingProcessId: w.onboardingProcessId,
  }));

  return sendData({ Workstations: list });
});
