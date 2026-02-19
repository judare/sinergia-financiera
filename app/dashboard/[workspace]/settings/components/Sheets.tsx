import { useEffect } from "react";
import { authorizeDatasource } from "@/app/services/datasource";
import { useApi } from "@/app/hooks/useApi";

export default function Sheets({ workspace }: any) {
  const { callApi } = useApi(authorizeDatasource);

  useEffect(() => {
    callApi({
      type: "sheets",
      workspaceId: workspace,
    }).then((res: any) => {
      if (res.Auth.url) {
        window.location.href = res.Auth.url;
      }
    });
  }, []);

  return (
    <div className="flex flex-col max-h-screen divide-y w-full  py-3 h-full  relative">
      Redireccionando a Google
    </div>
  );
}
