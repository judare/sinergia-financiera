"use client";

import { useSession } from "@/app/hooks/useSession";

import Header from "@/app/components/UI/Header";

export default function Reports() {
  // const { data: session } = useSession();

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      <Header />
      <main className="flex-1 px-20 py-6">
        <div className="mb-5 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">Reportes</h2>
            <p className="text-sm text-neutral-500 mt-1">Visual de reportes</p>
          </div>
        </div>
      </main>
    </div>
  );
}
