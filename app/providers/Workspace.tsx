import { useCallback, useEffect, useState } from "react";
import { fetchWorkspaces } from "@/app/services/workspace";
import { useApi } from "@/app/hooks/useApi";
import { useRouter, useParams } from "next/navigation";
import { createContext } from "use-context-selector";

const contextDefaultValue: any = {
  session: null,
};
const Context = createContext(contextDefaultValue);

type WorkspaceProviderProps = {
  children: any;
};

const WorkspaceProvider = ({ children }: WorkspaceProviderProps) => {
  const { workspace } = useParams<{ workspace: string }>();
  const { loading, callApi } = useApi(fetchWorkspaces);
  const [workspaces, setWorkspaces] = useState([]);
  const [currentWorkspace, setCurrentWorkspace] = useState({
    id: null,
    name: null,
  });
  const router = useRouter();

  useEffect(() => {
    getWorkspaces();
  }, []);

  const getWorkspaces = useCallback(async () => {
    const result = await callApi(workspace);
    setWorkspaces(result.Workspaces);
    setCurrentWorkspace(result.CurrentWorkspace);
    if (!result.CurrentWorkspace && workspace) {
      router.push(`/dashboard`);
    }
  }, [workspace]);

  return (
    <Context.Provider
      value={{
        workspaces,
        loading,
        getWorkspaces,
        currentWorkspace,
        setCurrentWorkspace,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { Context, WorkspaceProvider };
