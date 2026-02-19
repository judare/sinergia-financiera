"use client";
import { useEffect, useState } from "react";
import { useContext } from "use-context-selector";
import DS from "design-system";
import { useApi } from "@/app/hooks/useApi";
import { fetchUsage } from "@/app/services/bill";
import { ArrowUpRight } from "lucide-react";
import { formatUsage } from "@/lib/utils";
import { Context } from "@/app/providers/Session";

const CircularProgress = ({ progress = 0, size = 24, strokeWidth = 4 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#aaa"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#000"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={isNaN(offset) ? 0 : offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`} // inicia desde la parte superior
      />
    </svg>
  );
};

const UsagePercent = ({
  value = 0,
  limit = 0,
  loading,
  label,
  format,
  link,
}: any) => {
  return (
    <div>
      <div className="flex items-center justify-start gap-2 font-light text-sm text-neutral-400 group">
        <CircularProgress
          progress={(value / limit) * 100}
          size={18}
          strokeWidth={4}
        />

        <div className="text-xs mr-auto truncate">{label}</div>

        {!loading && link && (
          <a
            className="flex items-center gap-1 whitespace-nowrap text-sm font-light"
            href={link}
          >
            <span className="font-bold">{format(value || 0)}</span>
            <span>/</span>
            <span> {format(limit || 0)}</span>
            <ArrowUpRight className="size-4 text-blue-500 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-100" />
          </a>
        )}

        {!loading && !link && (
          <div className="flex items-center gap-1 whitespace-nowrap text-sm font-light">
            <span className="font-bold">{format(value || 0)}</span>
            <span>/</span>
            {format(limit || 0)}
          </div>
        )}
        {loading && <DS.Loader size="sm" />}
      </div>
    </div>
  );
};

export default function Usage() {
  const { callApi } = useApi(fetchUsage);
  const { business }: any = useContext(Context);

  const [bill, setBill] = useState({
    billId: null,
    planName: "",
    blockUsage: 0,
    blockUsageLimit: 0,
    aiToday: 0,
    aiUsageLimit: 0,
    includedMinutes: 0,
    minutesUsed: 0,
  });

  useEffect(() => {
    callApi().then((res: any) => {
      setBill(res);
    });
  }, []);

  if (bill?.minutesUsed === 0 && business?.onboarding == "initial") {
    return;
  }

  return (
    <div className="text-neutral-950   p-3 flex flex-col gap-3 bg-white shadow-xl border border-neutral-300    rounded-2xl ">
      <div className="text-sm mb-2">
        Uso del plan
        {bill?.planName && (
          <span className="ml-2 bg-black  text-white rounded-lg px-3 py-0.5 text-xs font-light">
            {bill?.planName}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <UsagePercent
          value={bill?.minutesUsed}
          limit={bill?.includedMinutes}
          loading={!bill?.billId}
          label="Minutos"
          link="/dashboard/settings#usage"
          color="bg-sky-500 dark:bg-[#0e9afa]"
          format={formatUsage}
        />
      </div>

      <div className="flex gap-2 ">
        <DS.Button
          text="Ir a facturación"
          href="/dashboard/settings#invoice"
          variant="secondary"
          className="w-full font-light "
          size="md"
        />
      </div>
    </div>
  );
}
