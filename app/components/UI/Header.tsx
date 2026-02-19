"use client";

import { useSession } from "@/app/hooks/useSession";
import AvatarName from "./AvatarName";

export default function Header() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-neutral-200">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold text-neutral-900">Sinergia</span>
      </div>
      {user && (
        <a className="flex items-center gap-3" href="/api/auth/logout">
          <span className="text-sm text-neutral-600">{user.name}</span>
          <AvatarName name={user.name} id={user.id} size="sm" />
        </a>
      )}
    </header>
  );
}
