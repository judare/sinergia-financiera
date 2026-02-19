"use client";
import { useState } from "react";
import DS from "design-system";
import { useSession } from "@/app/hooks/useSession";
import Tabs from "@/app/components/UI/Tabs";
// import Tab from "@/app/components/UI/Tab";
import { SparkleIcon, Wallet, User, PhoneCall } from "lucide-react";
import Invoice from "./Invoice";
import UpdateCard from "./UpdateCard";
import BusinessInfo from "./BusinessInfo";
import Invoices from "./Invoices";
import Users from "./ListUsers";
import IA from "./IA";
import ListPhoneNumbers from "./ListPhoneNumbers";

export default function BillingView() {
  const { data: session }: any = useSession();

  const [invoice, setInvoice] = useState(null);
  const [currentTab, setCurrentTab] = useState("ia");

  if (!session?.business) {
    return <DS.Loader size="md" className="mx-auto" />;
  }
  return (
    <div>
      <Tabs
        currentTab={currentTab}
        onSelect={setCurrentTab}
        tabs={[
          { tab: "invoice", name: "Facturación", icon: Wallet },
          { tab: "ia", name: "Configurar IA", icon: SparkleIcon },
          { tab: "usage", name: "Uso", icon: Wallet },
          { tab: "users", name: "Usuarios", icon: User },
          {
            tab: "phone-numbers",
            name: "Numeros de teléfono",
            icon: PhoneCall,
          },
        ]}
      ></Tabs>

      <div className="py-5 flex gap-10 flex-col max-w-[40rem] mx-auto ">
        {currentTab == "invoice" && (
          <>
            {invoice && (
              <Invoice invoice={invoice} onBack={() => setInvoice(null)} />
            )}
            {!invoice && (
              <>
                <UpdateCard />

                <BusinessInfo session={session} />

                <Invoices setInvoice={setInvoice} />
              </>
            )}
          </>
        )}

        {currentTab == "ia" && <IA session={session} />}
        {/* {currentTab == "usage" && <BlockUsage />} */}
        {currentTab == "users" && <Users />}
        {currentTab == "phone-numbers" && <ListPhoneNumbers />}
      </div>
    </div>
  );
}
