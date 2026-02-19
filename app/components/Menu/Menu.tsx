"use client";
import React from "react";
import { useSession } from "@/app/hooks/useSession";
import { usePathname } from "next/navigation";
import Workspace from "./Workspace";
import Usage from "./Usage";
import { Context } from "@/app/providers/Workspace";
import {
  ChevronRight,
  Code,
  Database,
  LockKeyhole,
  PhoneCall,
  User,
  User2,
} from "lucide-react";
import { useContextSelector } from "use-context-selector";
import { motion } from "framer-motion";

type MenuOptionProps = {
  name: string;
  icon: any;
  href: string;
  currentPath: string;
  className?: string;
};

const MenuOption = ({
  name,
  icon,
  currentPath,
  href,
  className,
}: MenuOptionProps) => {
  const isActive = (href: string) => currentPath === href;
  const Icon = icon;

  return (
    <li className={className}>
      <a
        className={
          "py-1.5 text-sm   rounded-lg px-1.5 flex justify-between items-center gap-2 " +
          (isActive(href)
            ? " text-neutral-600 font-medium bg-white  "
            : " hover:bg-neutral-100 ")
        }
        href={href}
      >
        <Icon
          className={
            "size-5 text-neutral-500  " +
            (isActive(href) ? "text-neutral-800" : "text-neutral-500")
          }
        />
        <div>{name}</div>
        <ChevronRight className="size-5 ml-auto text-neutral-500" />
      </a>
    </li>
  );
};

type MenuProps = {
  view?: any;
  onClickBlock?: any;
  editMode?: any;
  setDefaultView?: any;
  className?: string;
};
export default function Menu({ className = "" }: MenuProps) {
  const pathName = usePathname();
  const { data: session }: any = useSession();
  const currentWorkspace = useContextSelector(
    Context,
    (a) => a.currentWorkspace
  );
  const isAdmin = session?.user?.rol == "admin";

  return (
    <motion.div
      className={
        "select-none h-screen  lg:block hidden sticky py-3 top-0 lg:w-[15rem]  z-20 shrink-0  " +
        className
      }
      onClick={(e) => {
        e.stopPropagation();
      }}
      transition={{ duration: 0.3, ease: [0, 0.71, 0.2, 1.01] }}
      initial={{ opacity: 0, x: -300 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="h-full overflow-y-auto overscroll-y-contain	 no-scrollbar  font-light  hidden  rounded-2xl text-sm  pt-2  text-neutral-600 w-full  items-center gap-5 lg:px-0 px-3 lg:flex flex-col scrollable-div ">
        <Workspace />

        <ul className="px-1 lg:flex w-full  h-full  flex-col ">
          <MenuOption
            currentPath={pathName}
            name="Agentes"
            icon={User}
            href={`/dashboard/${currentWorkspace?.id ?? ""}`}
          />
          {currentWorkspace?.id && (
            <>
              <MenuOption
                currentPath={pathName}
                name="Llamadas"
                icon={PhoneCall}
                href={`/dashboard/${currentWorkspace?.id}/calls`}
              />

              <MenuOption
                currentPath={pathName}
                name="Mis clientes"
                icon={User}
                href={`/dashboard/${currentWorkspace?.id}/customers`}
              />

              {isAdmin && (
                <MenuOption
                  currentPath={pathName}
                  name="Fuentes de datos"
                  icon={Database}
                  href={`/dashboard/${currentWorkspace?.id}/settings`}
                />
              )}
            </>
          )}

          {/* 

          {isAdmin && (
            <MenuOption
              currentPath={pathName}
              name="Usuarios"
              icon={UserCircle}
              href="/dashboard/users"
            />
          )}

          {isAdmin && (
            <MenuOption
              currentPath={pathName}
              name="Uso"
              icon={ChartLine}
              href="/dashboard/usage"
            />
          )}

         */}

          {isAdmin && (
            <MenuOption
              currentPath={pathName}
              name="Mi cuenta"
              icon={User2}
              href="/dashboard/settings"
              className="mt-auto"
            />
          )}

          <MenuOption
            currentPath={pathName}
            name="Desarrolladores"
            icon={Code}
            href="/dashboard/developers"
          />

          <MenuOption
            currentPath={pathName}
            name="Cerrar sesión"
            icon={LockKeyhole}
            href="/api/auth/logout"
          />
        </ul>

        <div className=" md:block hidden w-full ">
          <Usage />
        </div>
      </div>
    </motion.div>
  );
}
