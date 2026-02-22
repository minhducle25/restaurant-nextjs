"use client";

import { useAppStore } from "@/components/app-provider";
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
import { useTranslations } from "next-intl";

export default function NavItems({ className }: { className?: string }) {
  const t = useTranslations('NavItems');
  const role = useAppStore((state) => state.role);
  const setRole = useAppStore((state) => state.setRole);
  const disconnectSocket = useAppStore((state) => state.disconnectSocket);

  const menuItems: {
    title: string;
    href: string;
    role?: RoleType[];
    hideWhenLogged?: boolean;
  }[] = [
    { title: t('home'), href: '/' },
    { title: t('menu'), href: '/guest/menu', role: [Role.Guest] },
    { title: t('orders'), href: '/guest/orders', role: [Role.Guest] },
    { title: t('login'), href: '/login', hideWhenLogged: true },
    { title: t('manage'), href: '/manage/dashboard', role: [Role.Owner, Role.Employee] },
  ];

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
      toast.success(t('logoutSuccess'));
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
          {t('logout')}
        </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('logoutConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('logoutConfirmDesc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={logout}>{t('continue')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      )}

    </>
  );
}
