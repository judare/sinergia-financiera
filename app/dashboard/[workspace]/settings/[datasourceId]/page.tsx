import Menu from "@/app/components/Menu/Menu";
import { getServerSession } from "@/lib/sessionServer";
import Providers from "@/app/providers/Providers";
import PageContainer from "@/app/components/UI/PageContainer";
import ShowDatasource from "./components/ShowDatasource";
import { ChevronLeft, Database } from "lucide-react";

export default async function Settings(props: {
  params: Promise<{ slug: string; workspace: string; datasourceId: string }>;
}) {
  const params = await props.params;
  const session = await getServerSession();

  return (
    <Providers session={session}>
      <div className="lg:flex ">
        <Menu className="px-3" />
        <PageContainer
          header={
            <div className=" flex justify-between items-center">
              <div className="text-lg text-black font-medium flex items-center gap-2">
                <a href={`/dashboard/${params.workspace}/settings`}>
                  <ChevronLeft className="size-6 text-neutral-500 hover:text-black" />
                </a>
                <Database className="size-5" />
                <div>Editar conector</div>
              </div>
            </div>
          }
        >
          <ShowDatasource
            workspace={params.workspace}
            datasourceId={params.datasourceId}
          />
        </PageContainer>
      </div>
    </Providers>
  );
}
