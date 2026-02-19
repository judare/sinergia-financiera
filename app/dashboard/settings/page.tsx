import SettingsPage from "./components/SettingsPage";
import Menu from "@/app/components/Menu/Menu";
import { getServerSession } from "@/lib/sessionServer";
import Providers from "@/app/providers/Providers";
import PageContainer from "@/app/components/UI/PageContainer";

export default async function Billing() {
  const session = await getServerSession();

  return (
    <div className=" px-3 min-h-screen">
      <Providers session={session}>
        <div className="lg:flex">
          <Menu />
          <PageContainer>
            <SettingsPage />
          </PageContainer>
        </div>
      </Providers>
    </div>
  );
}
