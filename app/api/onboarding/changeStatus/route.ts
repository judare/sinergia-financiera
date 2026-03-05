import { withUser } from "@/lib/withUser";
import { NextResponse } from "next/server";
import db from "@/db/conn";

const { OnboardingProcess } = db;

const ALLOWED_STATUSES = ["rejected", "finished"];

export const POST = withUser(async function ({ user, body }: any) {
  const { id, status } = body.data;

  if (!ALLOWED_STATUSES.includes(status)) {
    return NextResponse.json(
      { data: { message: "Estado no permitido" } },
      { status: 400 },
    );
  }

  const process = await OnboardingProcess.findByPk(id);

  if (!process) {
    return NextResponse.json(
      { data: { message: "Proceso no encontrado" } },
      { status: 404 },
    );
  }

  if (process.managerId !== user.id) {
    return NextResponse.json(
      { data: { message: "No tienes permiso para cambiar el estado" } },
      { status: 403 },
    );
  }

  if (process.status !== "pending") {
    return NextResponse.json(
      {
        data: {
          message: "Solo se puede cambiar el estado de procesos pendientes",
        },
      },
      { status: 400 },
    );
  }

  await process.update({ status });

  return NextResponse.json({ data: {} });
});
