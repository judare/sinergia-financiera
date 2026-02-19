"use client";
import DS from "design-system";
export default function AddCreditCard({ text }: any) {
  return (
    <div className=" text-sky-700 font-light px-5 py-3 rounded-xl flex items-center justify-between gap-5 bg-gradient-to-r from-sky-100 to-lime-50   border border-black/10 ">
      <div>{text}</div>
      <DS.Button
        href="/dashboard/settings"
        text="Mejorar plan"
        variant="primary"
      />
    </div>
  );
}
