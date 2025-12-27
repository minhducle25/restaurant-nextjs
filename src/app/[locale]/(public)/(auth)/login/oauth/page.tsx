"use client";

import {  useAppStore } from "@/components/app-provider";
import { decodeToken, generateSocketInstance } from "@/lib/utils";
import { useSetTokenToCookieMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function OAuth() {
  const { mutateAsync } = useSetTokenToCookieMutation();
  const setRole = useAppStore((state) => state.setRole);
  const setSocket = useAppStore((state) => state.setSocket);
  
  const searchParms = useSearchParams();
  const accessToken = searchParms.get("accessToken");
  const refreshToken = searchParms.get("refreshToken");
  const message = searchParms.get("message");
  const router = useRouter();
  useEffect(() => {
    if (!accessToken || !refreshToken) {
      setTimeout(() => {
        toast.error(message || "Đăng nhập thất bại, vui lòng thử lại");
      });
    } else {
      const { role } = decodeToken(accessToken);
      mutateAsync({ accessToken, refreshToken })
        .then(() => {
          toast.success("Đăng nhập thành công");
          setRole(role);
          setSocket(generateSocketInstance(accessToken));
          router.push("/manage/dashboard");
        })
        .catch((e) => {
          setTimeout(() => {
            toast.error(message || "Đăng nhập thất bại, vui lòng thử lại");
          });
        });
    }
  }, [accessToken, refreshToken, setRole, router, setSocket, message, mutateAsync]);

  return null;
}
