import { formatUsage } from "@/lib/utils";

const BillDetail = ({ label, value = 0, limit, amount }: any) => {
  return (
    <div className="py-2 flex items-center justify-between gap-2 font-light text-sm text-neutral-600 ">
      <div className="flex-1">{label}</div>

      <div className=" flex-1 text-right">
        <span className="">{value}</span>
        {limit && (
          <>
            <span>/</span>
            {formatUsage(limit || 0)}
          </>
        )}
      </div>

      {amount && (
        <span className=" flex-1 text-right">${amount?.toFixed(2)}</span>
      )}
    </div>
  );
};

export default BillDetail;
