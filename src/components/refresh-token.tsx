import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage, setAccessTokenToLocalStorage, setRefreshTokenToLocalStorage } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import jwt from "jsonwebtoken";
import authApiRequests from "@/apiRequests/auth";

const UNAUTHENTICATED_PATHS = ["/login", "/logout", "/refresh-token"]

export default function RefreshToken() {
  const pathname = usePathname();
  useEffect(() => {
    if (UNAUTHENTICATED_PATHS.includes(pathname)) return
    let interval: any = null
    const checkAndRefreshToken = async () => {
        const accessToken = getAccessTokenFromLocalStorage();
        const refreshToken = getRefreshTokenFromLocalStorage();
        // return early if either token is missing so decode() is called only with strings
        if (!accessToken || !refreshToken) return
        const decodedAccessToken = jwt.decode(accessToken) as { exp: number ; iat: number };
        const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number ; iat: number };
        const now = Math.round(new Date().getTime() / 1000);
        if(decodedRefreshToken.exp <= now) return
        if(decodedAccessToken.exp - now < (decodedAccessToken.exp - decodedAccessToken.iat) / 3) {
            try {
                const res = await authApiRequests.refreshToken()
                setAccessTokenToLocalStorage(res.payload.data.accessToken)
                setRefreshTokenToLocalStorage(res.payload.data.refreshToken)
            } catch (error) {
                console.error(error)
                clearInterval(interval)
            }
        }
    }
    //called immediately because interval will be excuted after TIMEOUT first
    checkAndRefreshToken()
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