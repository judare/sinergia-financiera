"use client";

import { WorkspaceProvider } from "./Workspace";
import { SessionProvider } from "./Session";

export default function Providers({ children, session }: any) {
  return (
    <SessionProvider session={session}>
      <WorkspaceProvider>{children}</WorkspaceProvider>
    </SessionProvider>
  );
}
