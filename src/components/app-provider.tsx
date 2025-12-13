"use client";
import RefreshToken from "@/components/refresh-token";
import { decodeToken, generateSocketInstance, getAccessTokenFromLocalStorage, removeTokensFromLocalStorage } from "@/lib/utils";
import { RoleType } from "@/types/jwt.types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useContext, createContext, useState, useCallback, useEffect } from "react";
import { Socket } from "socket.io-client";
import { useEffectEvent } from "react";
import ListenLogoutSocket from "@/components/listen-logout-socket";
 
//default
//staleTime: 0
//gc: 5 minutes ( 5* 1000*60)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const AppContext = createContext({
  isAuth: false,
  role: undefined as RoleType | undefined,
  setRole: (role: RoleType | undefined) => {},
  socket: undefined as Socket | undefined,
  setSocket: (socket?: Socket | undefined) => {},
  disconnectSocket: () => {}
})

export const useAppContext = () => {
  return useContext(AppContext);
}
export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [socket, setSocket] = useState<Socket | undefined>();
  const [role, setRoleState] = useState<RoleType | undefined>() 
  
  const onSetRoleState = useEffectEvent(setRoleState);
  const onSetSocket = useEffectEvent(setSocket);

  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage();
    if (accessToken) {
      const role =  decodeToken(accessToken).role;
      onSetRoleState(role)
      const socketInstance = generateSocketInstance(accessToken);
      onSetSocket(socketInstance)      
    }
    return undefined;
  }, [])

  const disconnectSocket = useCallback(() => {
          socket?.disconnect()
      setSocket(undefined)
  }, [socket, setSocket])

  const setRole = useCallback((role?: RoleType | undefined) => {
    setRoleState(role);
    if(!role){  
      removeTokensFromLocalStorage()
    }
  }, [])

  const isAuth = Boolean(role);
  return (
    <AppContext.Provider value={{role, setRole, isAuth, socket, setSocket, disconnectSocket}}>
    <QueryClientProvider client={queryClient}>
      {children}
      <RefreshToken />
      <ListenLogoutSocket />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    </AppContext.Provider>
  );
}
