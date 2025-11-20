"use client";
import RefreshToken from "@/components/refresh-token";
import { getAccessTokenFromLocalStorage, removeTokensFromLocalStorage } from "@/lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useContext, createContext, useState, useCallback } from "react";
 
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

const AppContext = createContext({
  isAuth: false,
  setIsAuth: (isAuth: boolean) => {},
})

export const useAppContext = () => {
  return useContext(AppContext);
}
export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuth, setIsAuthState] = useState<boolean>(() => !!getAccessTokenFromLocalStorage())
  
  const setIsAuth = useCallback((isAuth: boolean) => {
    if(isAuth){
      setIsAuthState(true)  
    } else {
      setIsAuthState(false)
      removeTokensFromLocalStorage()
    }
  }, [])

  return (
    <AppContext.Provider value={{isAuth, setIsAuth}}>
    <QueryClientProvider client={queryClient}>
      {children}
      <RefreshToken />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    </AppContext.Provider>
  );
}
