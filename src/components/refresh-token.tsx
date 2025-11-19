import { checkAndRefreshToken } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const UNAUTHENTICATED_PATHS = ["/login", "/logout", "/refresh-token"]

export default function RefreshToken() {
  const pathname = usePathname();
  useEffect(() => {
    if (UNAUTHENTICATED_PATHS.includes(pathname)) return
    let interval: any = null

    //called immediately because interval will be excuted after TIMEOUT first
    checkAndRefreshToken({
        onError: () =>{clearInterval(interval)}
    })
    // time out must be less than token expiry time
    const TIMEOUT = 1000
    interval = setInterval(checkAndRefreshToken, TIMEOUT)
}, [pathname]);
  return null
}
//rule for refresh token:
//do not make duplicate requests, always clear interval and set reFreshTokenRequest in auths to null after request is completed
//always return 401 on failed called to route handler
//when useEffect failed on client, clear interval
//exclude pages that do not need authentication
//other logics are handled in proxy ( middleware)