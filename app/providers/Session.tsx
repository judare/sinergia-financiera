"use client";

import { useRef } from "react";
import { createContext } from "use-context-selector";
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
  const toastConfirmRef = useRef<any>(null);

  const showToastConfirm = (message: string, type = "success") => {
    toastConfirmRef?.current?.show(message, type);
  };

  return (
    <Context.Provider
      value={{
        session,
        showToastConfirm,
      }}
    >
      <ConfirmToast ref={toastConfirmRef} />

      {children}
    </Context.Provider>
  );
};

export { Context, SessionProvider };
