import { getServerSession } from "@/lib/sessionServer";
import { SessionProvider } from "../providers/Session";
import { Header } from "../components/Header";
import Footer from "../components/Footer";
import UpgradePlan from "../dashboard/settings/components/UpgradePlan";

export default async function PricingPage() {
  const session = await getServerSession();

  return (
    <SessionProvider session={session}>
      <div className="bg-white text-neutral-600">
        <div className=" py-3 px-5 lg:px-10 xl:px-20 xl:w-[1280px] mx-auto">
          <div className="relative z-10 min-h-screen pb-10 flex flex-col  ">
            <Header />

            <UpgradePlan />
          </div>
          <Footer />
        </div>
      </div>
    </SessionProvider>
  );
}
