"use client";

import { useAppContext } from "@/components/app-provider";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

function LogOut(){
    const { mutateAsync } = useLogoutMutation();
  const router = useRouter();
  const {setRole, disconnectSocket}  = useAppContext()
  const searchParams = useSearchParams();
  const refreshTokenfromUrl = searchParams.get("refreshToken") || "";
  const accessTokenFromUrl = searchParams.get("accessToken") || "";
  const ref = useRef<any>(null);
  useEffect(() => {
    if (
      !ref.current ||
      (refreshTokenfromUrl &&
        refreshTokenfromUrl === getRefreshTokenFromLocalStorage()) ||
      (accessTokenFromUrl &&
        accessTokenFromUrl === getAccessTokenFromLocalStorage())
    ){
    ref.current = mutateAsync;
    console.log(ref);
    mutateAsync().then((res) => {
      setTimeout(() => {
        ref.current = null;
      }, 1000);
      setRole(undefined);
      disconnectSocket()
      router.push("/login");
    })
  }else{
    router.push('/')
  }
  }, [mutateAsync, router, refreshTokenfromUrl, accessTokenFromUrl, setRole, disconnectSocket]);
  return <div>Logging out...</div>;
}
export default function LogoutPage() {
  return (
    <Suspense>
      <LogOut />
  </Suspense>
  )
}
