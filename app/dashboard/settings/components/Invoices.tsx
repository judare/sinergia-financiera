"use client";
import { useEffect, useState } from "react";
import { fetchBills } from "@/app/services/bill";
import { useApi } from "@/app/hooks/useApi";
import { ChevronRight } from "lucide-react";
import Card from "./Card";

const Invoice = ({ bill, setInvoice }: any) => {
  return (
    <div
      className="flex flex-col gap-2 py-2.5 cursor-pointer"
      onClick={() => {
        setInvoice(bill);
      }}
    >
      <div className="text-sm font-light text-neutral-500 flex items-center gap-2 justify-between">
        <div>
          <div className="flex gap-2">
            <div className="bg-transparent py-0.5 rounded-lg">
              {bill.isCurrent ? "Factura actual" : `Número ${bill.number}`}
            </div>
          </div>

          <div className="flex gap-2 text-xs items-center">
            <div>{bill.startBillingCycle}</div>
            <div>
              <ChevronRight className="w-4 h-4" />
            </div>
            <div>{bill.endBillingCycle}</div>

            <div>
              <div
                className={`
                ${bill.isCurrent && "bg-black text-white"}
                ${!bill.isCurrent && bill.paid && "bg-[#00320b] text-[#00ca51]"}
                ${!bill.isCurrent && !bill.paid && "bg-white/20 text-gray-300"}
                px-3 py-0.5 rounded-lg text-xs`}
              >
                {!bill.isCurrent && bill.paid == 0 && "Unpaid"}
                {!bill.isCurrent && bill.paid == 1 && "Paid"}
                {bill.isCurrent && "Factura actual"}
              </div>
            </div>
          </div>
        </div>
        {!bill.isCurrent && (
          <div className="">
            <div className="text-xs">Total</div>
            <div className="">${bill.amount?.toFixed(2)}</div>
          </div>
        )}
      </div>
    </div>
  );
};
export default function Invoices({ setInvoice }: any) {
  const { callApi } = useApi(fetchBills);
  const [bills, setBills] = useState([]);

  useEffect(() => {
    callApi().then((res: any) => {
      setBills(res);
    });
  }, []);

  if (!bills.length) {
    return;
  }
  return (
    <Card
      title="Facturas"
      body={
        <div className="flex flex-col divide-y w-full divide-white/10">
          {bills.map((bill: any) => (
            <Invoice bill={bill} key={bill.id} setInvoice={setInvoice} />
          ))}
        </div>
      }
    />
  );
}
