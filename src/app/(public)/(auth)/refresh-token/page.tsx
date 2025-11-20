"use client";

import {
  checkAndRefreshToken,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RefreshTokenPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshTokenfromUrl = searchParams.get("refreshToken") || "";
  const redirectPath = searchParams.get("redirect") || "/";
  useEffect(() => {
    if (
      refreshTokenfromUrl &&
        refreshTokenfromUrl === getRefreshTokenFromLocalStorage()){
      checkAndRefreshToken({
        onSuccess: () => {
          router.push(redirectPath || '/');
        }
      })
    }else{
      router.push('/')
    }
  }, [, router, refreshTokenfromUrl, redirectPath]);
  return <div>Refresh Token...</div>;
}
