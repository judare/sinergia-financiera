"use client";
import { SparklesIcon } from "lucide-react";

export default function Header({ onCreate }: any) {
  return (
    <div className=" flex justify-between items-center">
      <div className="text-lg text-black font-medium flex items-center gap-2">
        <SparklesIcon className="size-5" />
        <div>Terminar registro</div>
      </div>
    </div>
  );
}
