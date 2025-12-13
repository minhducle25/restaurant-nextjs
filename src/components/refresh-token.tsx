import { useAppContext } from "@/components/app-provider";
import { checkAndRefreshToken } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const UNAUTHENTICATED_PATHS = ["/login", "/logout", "/refresh-token"];

export default function RefreshToken() {
  const pathname = usePathname();
  const router = useRouter();
  const { socket, disconnectSocket } = useAppContext();
  useEffect(() => {
    if (UNAUTHENTICATED_PATHS.includes(pathname)) return;
    let interval: any = null;

    //called immediately because interval will be excuted after TIMEOUT first
    const onRefreshToken = (force?: boolean) =>
      checkAndRefreshToken({
        onError: () => {
          clearInterval(interval);
          disconnectSocket()
          router.push("/login");
        },
        force,
      });
    onRefreshToken();
    // time out must be less than token expiry time
    const TIMEOUT = 1000;
    interval = setInterval(onRefreshToken, TIMEOUT);

    if (socket?.connected) {
      onConnect();
    }

    function onConnect() {
      console.log(socket?.id);
    }

    function onDisconnect() {
      console.log("disconnected");
    }

    function onRefreshTokenSocket() {
      onRefreshToken(true);
    }
    socket?.on("connect", onConnect);
    socket?.on("disconnect", onDisconnect);
    socket?.on("refresh-token", onRefreshTokenSocket);
    return () => {
      clearInterval(interval);
      socket?.off("connect", onConnect);
      socket?.off("disconnect", onDisconnect);
      socket?.off("refresh-token", onRefreshTokenSocket);
    };
  }, [pathname, router, socket, disconnectSocket]);
  return null;
}
//rule for refresh token:
//do not make duplicate requests, always clear interval and set reFreshTokenRequest in auths to null after request is completed
//always return 401 on failed called to route handler
//when useEffect failed on client, clear interval
//exclude pages that do not need authentication
//other logics are handled in proxy ( middleware)
