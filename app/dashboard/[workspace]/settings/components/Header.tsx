"use client";
import { Database } from "lucide-react";

export default function Header({}: any) {
  return (
    <div className=" flex justify-between items-center">
      <div className="text-lg text-black font-medium flex items-center gap-2">
        <Database className="size-5" />
        <div>Mis conectores</div>
      </div>
    </div>
  );
}
