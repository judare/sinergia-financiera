import Menu from "@/app/components/Menu/Menu";
import { getServerSession } from "@/lib/sessionServer";
import Providers from "@/app/providers/Providers";
import PageContainer from "@/app/components/UI/PageContainer";
import Developers from "./components/Developers";
import Header from "./components/Header";

export default async function Settings(props: {
  params: Promise<{ slug: string; workspace: string }>;
}) {
  const params = await props.params;
  const session = await getServerSession();

  return (
    <Providers session={session}>
      <div className="lg:flex ">
        <Menu className="px-3" />
        <PageContainer header={<Header />}>
          <Developers />
        </PageContainer>
      </div>
    </Providers>
  );
}
