"use client";

import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function LogoutPage() {
  const { mutateAsync } = useLogoutMutation();
  const router = useRouter();
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
      router.push("/login");
    })
  }else{
    router.push('/')
  }
  }, [mutateAsync, router, refreshTokenfromUrl, accessTokenFromUrl]);
  return <div>Logging out...</div>;
}
