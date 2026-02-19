"use client";
import { useEffect, useState } from "react";
import { fetchUsage } from "@/app/services/bill";
import { useApi } from "@/app/hooks/useApi";
import Card from "./Card";
import { ChevronLeft } from "lucide-react";
import { formatUsage } from "@/lib/utils";
import BillDetail from "./BillDetail";

export default function Invoice({ invoice, onBack }: any) {
  const { callApi: getBillDetail } = useApi(fetchUsage);
  const [bill, setBill] = useState({
    billId: null,
    billStart: "",
    billEnd: "",
    amount: 0,
    planName: "",
    blockUsage: 0,
    blockUsageLimit: 0,
    Details: {} as any,
  });

  useEffect(() => {
    getBillDetail(invoice?.id).then((res: any) => {
      setBill(res);
    });
  }, []);

  const estimated: any =
    Object.values(bill?.Details).reduce((acc: any, item: any) => {
      return acc + (item?.amount || 0);
    }, 0) || 0;

  return (
    <Card
      title={
        <div className="text-neutral-600">
          <div
            onClick={onBack}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-700 cursor-pointer mb-5"
          >
            <ChevronLeft className="size-4" />
            Mostrar todas las facturas
          </div>
          <div>Factura #{invoice?.id}</div>
        </div>
      }
      subtitle={
        invoice?.isCurrent ? (
          <>
            Actualmente estás en el plan
            <span className=" font-medium ml-3 bg-neutral-200 text-neutral-600 px-3 py-0.5 rounded-md dark:bg-neutral-800">
              {bill?.planName}
            </span>
          </>
        ) : undefined
      }
      body={
        <div className="mt-5 flex flex-col divide-y divide-white/10">
          <BillDetail
            label="Inicio del ciclo"
            value={invoice.startBillingCycle}
          />
          <BillDetail label="Final del ciclo" value={invoice.endBillingCycle} />

          <BillDetail label="Número de factura" value={invoice?.number} />
          <BillDetail
            label="Usuarios"
            value={bill?.Details?.USERS?.value}
            amount={bill?.Details?.USERS?.amount}
          />

          <BillDetail
            label="Llamadas"
            value={formatUsage(bill?.Details?.BLOCK_EXECUTIONS?.value || 0)}
            amount={bill?.Details?.BLOCK_EXECUTIONS?.amount}
          />

          <BillDetail
            label="Duración llamadas"
            value={
              ((bill?.Details?.BLOCK_TIME?.value || 0) / 1000).toFixed() + "s"
            }
            amount={bill?.Details?.BLOCK_TIME?.amount}
          />

          <BillDetail
            label="LLM Tokens de entrada"
            value={formatUsage(bill?.Details?.INPUT_TOKENS?.value || 0)}
            amount={bill?.Details?.INPUT_TOKENS?.amount}
          />

          <BillDetail
            label="LLM Tokens de salida"
            value={formatUsage(bill?.Details?.OUTPUT_TOKENS?.value || 0)}
            amount={bill?.Details?.OUTPUT_TOKENS?.amount}
          />

          {!invoice.isCurrent && (
            <BillDetail
              label="Total"
              value={"$" + invoice?.amount?.toFixed(2)}
            />
          )}

          {invoice.isCurrent && estimated > 0 && (
            <BillDetail label="Estimado" value={"$" + estimated?.toFixed(2)} />
          )}
        </div>
      }
    />
  );
}
