"use client";

import { useAppContext } from "@/components/app-provider";
import { Role } from "@/constants/type";
import { useLogoutMutation } from "@/queries/useAuth";
import { useGuestLogoutMutation } from "@/queries/useGuest";
import { RoleType } from "@/types/jwt.types";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn, handleErrorApi } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
const menuItems: {
  title: string;
  href: string;
  role?: RoleType[];
  hideWhenLogged?: boolean;
}[] = [
  {
    title: "Trang Chủ",
    href: "/",
  },
  {
    title: "Menu",
    href: "/guest/menu",
    role: [Role.Guest],
  },
  {
    title: "Order",
    href: "/guest/orders",
    role: [Role.Guest],
  },
  {
    title: "Đăng nhập",
    href: "/login",
    hideWhenLogged: true,
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    role: [Role.Owner, Role.Employee],
  },
];

export default function NavItems({ className }: { className?: string }) {
  const { role, setRole, disconnectSocket } = useAppContext();
  const logoutMutation = useLogoutMutation();
  const guestLogoutMutation = useGuestLogoutMutation();
  const router = useRouter();
  
  const logout = async () => {
    // Kiểm tra role để dùng đúng mutation
    const mutation = role === Role.Guest ? guestLogoutMutation : logoutMutation;
    
    if (mutation.isPending) return;
    try {
      await mutation.mutateAsync();
      setRole(undefined);
      disconnectSocket();
      toast.success("Đăng xuất thành công");
      router.push("/");
    } catch (error: any) {
      console.error("[ui/logout] mutation error:", error);
      handleErrorApi({ error });
    }
  };
  return (
    <>
      {menuItems.map((item) => {
        //nav bar for logged in users
        const isAuth = item.role && role && item.role.includes(role);
        //nav bar for not logged in users
        const isUnauthenticated =
          (item.role === undefined && !item.hideWhenLogged) ||
          (!role && item.hideWhenLogged);
        if (isAuth || isUnauthenticated) {
          return (
            <Link href={item.href} key={item.href} className={className}>
              {item.title}
            </Link>
          );
        }
        return null;
      })}

      {role && (
      <AlertDialog>
        <AlertDialogTrigger>
                  <div className={cn(className, "cursor-pointer")}>
          Log Out
        </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có muốn đăng xuất không?</AlertDialogTitle>
            <AlertDialogDescription>
              Việc đăng xuất có thể làm mất đi hoá đơn của bạn
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Thoát</AlertDialogCancel>
            <AlertDialogAction onClick={logout}>Tiếp tục</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      )}

    </>
  );
}
