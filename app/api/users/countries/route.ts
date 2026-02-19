import { NextRequest } from "next/server";
import { sendData } from "@/lib/response";
import db from "@/db/conn";

const { Country } = db;

export const POST = async (req: NextRequest) => {
  let countries = await Country.findAll({
    where: {},
  });

  let list = countries.map((x: any) => ({
    id: x.id,
    name: x.name,
    code: x.code,
    indicator: x.indicator,
  }));
  return sendData({
    Countries: list,
  });
};
