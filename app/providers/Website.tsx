"use client";
import { useEffect, useState } from "react";
// import { createContext } from "react";
import { useApi } from "@/app/hooks/useApi";
import { fetchWorkspaces } from "@/app/services/workspace";
import { createContext } from "use-context-selector";

const contextDefaultValue: any = {
  session: null,
};
const Context = createContext(contextDefaultValue);

type SessionProviderProps = {
  children: any;
  session?: any;
};

const WebsiteProvider = ({ children, session }: SessionProviderProps) => {
  const { callApi: callApiFetch } = useApi(fetchWorkspaces);
  const [workspaces, setWorkspaces] = useState([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<any>(0);
  const getWorkspaces = async () => {
    if (!session?.user) return;
    const result = await callApiFetch();
    setWorkspaces(result.Workspaces);
    setCurrentWorkspace(result.Workspaces[0]);
  };

  useEffect(() => {
    getWorkspaces();
  }, []);
  return (
    <Context.Provider
      value={{
        session,
        workspaces,
        currentWorkspace,
        setCurrentWorkspace,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { Context, WebsiteProvider };
