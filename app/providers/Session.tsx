"use client";

import { useRef } from "react";
import { createContext } from "use-context-selector";
import { useState, useEffect } from "react";
import { fetchBusiness } from "@/app/services/users";
import { useApi } from "@/app/hooks/useApi";
import ConfirmToast from "../components/UI/ConfirmToast";

const contextDefaultValue: any = {
  session: null,
};
const Context = createContext(contextDefaultValue);

type SessionProviderProps = {
  children: any;
  session?: any;
};

const SessionProvider = ({ children, session }: SessionProviderProps) => {
  const { callApi: callGet } = useApi(fetchBusiness);
  const [business, setBusiness] = useState<any>(null);
  const toastConfirmRef = useRef<any>(null);

  const getBusiness = async () => {
    const data = await callGet();
    setBusiness(data);
  };

  useEffect(() => {
    getBusiness();
  }, []);

  const showToastConfirm = (message: string, type = "success") => {
    toastConfirmRef?.current?.show(message, type);
  };

  return (
    <Context.Provider
      value={{
        session,
        business,
        getBusiness,
        showToastConfirm,
        hasToPay: business?.hasToPay,
      }}
    >
      <ConfirmToast ref={toastConfirmRef} />

      {children}
    </Context.Provider>
  );
};

export { Context, SessionProvider };
