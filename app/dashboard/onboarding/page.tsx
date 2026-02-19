import Menu from "@/app/components/Menu/Menu";
import { getServerSession } from "@/lib/sessionServer";
import Providers from "@/app/providers/Providers";
import PageContainer from "@/app/components/UI/PageContainer";
import Header from "./components/Header";
import SetupPage from "./components/Setup";

export default async function Settings(props: {
  params: Promise<{ slug: string; workspace: string }>;
}) {
  const params = await props.params;
  const session = await getServerSession();

  return (
    <Providers session={session}>
      <div className="lg:flex ">
        <Menu className="px-3" />
        <PageContainer header={<Header workspace={params.workspace} />}>
          <SetupPage workspace={params.workspace} />
        </PageContainer>
      </div>
    </Providers>
  );
}
