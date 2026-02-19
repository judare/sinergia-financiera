"use client";
import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { useSession } from "@/app/hooks/useSession";
import { useRouter } from "next/navigation";

import { UserIcon } from "lucide-react";
import DS from "design-system";

export function Header({ className }: any) {
  const { data: session }: any = useSession();
  const router = useRouter();

  return (
    <div className={cn(`h-16 md:h-20`, className)}>
      <header
        className={`fixed left-0 w-full  top-5   transition-border`}
        style={{
          zIndex: 50,
        }}
      >
        <div
          className={`flex text-black font-light px-5  xl:w-[600px] mx-auto
          w-full items-center h-16 justify-between bg-neutral-200/40 backdrop-blur-2xl rounded-2xl `}
        >
          <div className="flex items-center justify-between w-full px-5">
            <div className="flex h-14 justify-between items-center">
              <Link href="/">
                <img
                  src="/logo.svg"
                  alt="logo"
                  className="h-6 md:h-7 items-center justify-center lg:mr-8"
                />
              </Link>
            </div>
            <div className="flex gap-2">
              {session?.user && (
                <div className="flex items-center space-x-3 ml-auto">
                  <DS.Button
                    variant="primary"
                    icon={UserIcon}
                    onClick={() => {
                      router.push("/dashboard");
                    }}
                    text="Dashboard"
                    size="md"
                  />
                </div>
              )}

              {!session?.user && (
                <div className="flex items-center space-x-3 ml-auto">
                  <DS.Button
                    variant="secondary"
                    onClick={() => {
                      router.push("/login");
                    }}
                    text="Iniciar Sesión"
                    size="md"
                  />
                  <DS.Button
                    variant="primary"
                    icon={UserIcon}
                    onClick={() => {
                      router.push("/register");
                    }}
                    text="Registrarse"
                    size="md"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
