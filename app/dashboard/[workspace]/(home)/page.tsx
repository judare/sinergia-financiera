import Menu from "@/app/components/Menu/Menu";
import ListAgents from "@/app/dashboard/[workspace]/(home)/components/ListAgents";
import { getServerSession } from "@/lib/sessionServer";
import Providers from "@/app/providers/Providers";
import PageContainer from "@/app/components/UI/PageContainer";

export default async function Home(props: {
  params: Promise<{ workspace: string }>;
}) {
  const params = await props.params;
  const session = await getServerSession();

  return (
    <Providers session={session}>
      <div className="lg:flex  divide-x divide-white/10  mx-auto">
        <Menu className="px-3" />
        <PageContainer>
          <ListAgents workspace={params.workspace} />
        </PageContainer>
      </div>
    </Providers>
  );
}
