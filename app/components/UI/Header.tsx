"use client";

import { useSession } from "@/app/hooks/useSession";
import AvatarName from "./AvatarName";

export default function Header() {
  const { data: session } = useSession();
  const user = session?.user;

  const Menu = [
    {
      name: "Procesos",
      href: "/dashboard/",
    },
    {
      name: "Gestión de usuarios",
      href: "/dashboard/users",
    },
    {
      name: "Reportes",
      href: "/dashboard/report",
    },
  ];
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-[#2d4b68] border-b border-neutral-200 text-white">
      <a className="flex items-center gap-2" href="/dashboard">
        <span className="text-lg font-semibold text-white">Sinergia</span>
      </a>
      <ul className="flex text-white gap-3 items-center">
        {Menu.map((item) => (
          <li key={item.name}>
            <a
              className="flex items-center gap-3 px-4 py-2 text-sm font-bold  hover:bg-white/10 rounded-xl"
              href={item.href}
            >
              {item.name}
            </a>
          </li>
        ))}
      </ul>
      {user && (
        <a className="flex items-center gap-3" href="/api/auth/logout">
          <span className="text-sm ">{user.fullName}</span>
          <AvatarName name={user.name} id={user.id} size="sm" />
        </a>
      )}
    </header>
  );
}
