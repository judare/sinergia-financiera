import { withUser } from "@/lib/withUser";
import { NextResponse } from "next/server";
import db from "@/db/conn";
import moment from "moment";

const { OnboardingProcess } = db;

export const POST = withUser(async function ({ user, body }: any) {
  const { id, startDate } = body.data;

  if (!startDate) {
    return NextResponse.json(
      { data: { message: "La fecha es requerida" } },
      { status: 400 },
    );
  }

  const newDate = moment(startDate).startOf("day");
  const today = moment().startOf("day");

  if (newDate.isBefore(today)) {
    return NextResponse.json(
      { data: { message: "No se puede colocar una fecha anterior a hoy" } },
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
      { data: { message: "No tienes permiso para modificar este proceso" } },
      { status: 403 },
    );
  }

  if (process.status !== "pending") {
    return NextResponse.json(
      { data: { message: "Solo se puede postergar procesos pendientes" } },
      { status: 400 },
    );
  }

  if (newDate.isBefore(moment(process.startDate).startOf("day"))) {
    return NextResponse.json(
      { data: { message: "La nueva fecha no puede ser anterior a la fecha actual del proceso" } },
      { status: 400 },
    );
  }

  await process.update({ startDate: newDate.toDate() });

  return NextResponse.json({ data: {} });
});
