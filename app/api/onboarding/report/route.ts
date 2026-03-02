import { withUser } from "@/lib/withUser";
import { NextResponse } from "next/server";
import db from "@/db/conn";

export const POST = withUser(async function () {
  const rawResults: any[] = await db.sequelize.query(
    `
    SELECT
      ar.areaId,
      a.name        AS areaName,
      ar.status,
      COUNT(ar.id)  AS \`count\`,
      AVG(TIMESTAMPDIFF(MINUTE, ar.createdAt, ar.updatedAt)) AS avgResponseTimeMinutes
    FROM area_requests ar
    INNER JOIN areas a ON ar.areaId = a.id
    WHERE ar.deletedAt IS NULL
      AND a.deletedAt  IS NULL
    GROUP BY ar.areaId, a.name, ar.status
    ORDER BY a.name, ar.status
    `,
    { type: db.Sequelize.QueryTypes.SELECT },
  );

  // Detalle por área + estado
  const byAreaStatus = rawResults.map((r: any) => ({
    areaId: Number(r.areaId),
    areaName: r.areaName,
    status: r.status,
    count: Number(r.count),
    avgResponseTimeMinutes: parseFloat(
      parseFloat(r.avgResponseTimeMinutes ?? 0).toFixed(2),
    ),
    avgResponseTimeHours: parseFloat(
      (parseFloat(r.avgResponseTimeMinutes ?? 0) / 60).toFixed(2),
    ),
  }));

  // Resumen por área (promedio ponderado)
  const areaMap: Record<number, any> = {};
  for (const item of byAreaStatus) {
    if (!areaMap[item.areaId]) {
      areaMap[item.areaId] = {
        areaId: item.areaId,
        areaName: item.areaName,
        total: 0,
        totalWeightedMinutes: 0,
      };
    }
    areaMap[item.areaId].total += item.count;
    areaMap[item.areaId].totalWeightedMinutes +=
      item.avgResponseTimeMinutes * item.count;
  }

  const byArea = Object.values(areaMap).map((a: any) => ({
    areaId: a.areaId,
    areaName: a.areaName,
    total: a.total,
    avgResponseTimeMinutes:
      a.total > 0
        ? parseFloat((a.totalWeightedMinutes / a.total).toFixed(2))
        : 0,
    avgResponseTimeHours:
      a.total > 0
        ? parseFloat((a.totalWeightedMinutes / a.total / 60).toFixed(2))
        : 0,
  }));

  return NextResponse.json({
    data: {
      byAreaStatus,
      byArea,
    },
  });
});
