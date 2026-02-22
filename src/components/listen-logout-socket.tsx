import { useAppStore } from "@/components/app-provider";
import { handleErrorApi } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const UNAUTHENTICATED_PATHS = ["/login", "/logout", "/refresh-token"];

const logoutMessages: Record<string, string> = {
  vi: "Đăng xuất thành công",
  en: "Logged out successfully",
};

export default function ListenLogoutSocket() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] ?? "vi";
  const logoutMessage = logoutMessages[locale] ?? logoutMessages["vi"];
  const router = useRouter();
  const { isPending, mutateAsync } = useLogoutMutation();
  const socket = useAppStore((state) => state.socket);
  const setRole = useAppStore((state) => state.setRole);
  const disconnectSocket = useAppStore((state) => state.disconnectSocket);
  useEffect(() => {
    if (UNAUTHENTICATED_PATHS.includes(pathname)) return;

    async function onLogout() {
      if (isPending) return;
      try {
        await mutateAsync();
      } catch (error: any) {
        // Ignore error if token is already deleted (account was removed by owner)
        console.log("[ui/logout] Could not call logout API, proceeding anyway");
      } finally {
        // Always clear local state and disconnect, regardless of API call result
        setRole(undefined);
        disconnectSocket();
        toast.success(logoutMessage);
        router.push("/");
      }
    }
    socket?.on("logout", onLogout);
    return () => {
      socket?.off("logout", onLogout);
    };
  }, [
    socket,
    pathname,
    router,
    mutateAsync,
    isPending,
    setRole,
    disconnectSocket,
    logoutMessage,
  ]);
  return null;
}
