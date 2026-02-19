"use client";
import { Key } from "lucide-react";
import CreateKey from "./CreateKey";

export default function Header({}: any) {
  return (
    <div className=" flex justify-between items-center">
      <div className="text-lg text-black font-medium flex items-center gap-2">
        <Key className="size-5" />
        <div>Desarrolladores</div>
      </div>

      <CreateKey />
    </div>
  );
}
