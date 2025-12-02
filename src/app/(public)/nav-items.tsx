"use client";

import { useAppContext } from "@/components/app-provider";
import { Role } from "@/constants/type";
import { useLogoutMutation } from "@/queries/useAuth";
import { RoleType } from "@/types/jwt.types";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn, handleErrorApi } from "@/lib/utils";
const menuItems: {
  title: string;
  href: string;
  role?: RoleType[];
  hideWhenLogged?: boolean;
}[] = [
  {
    title: "Trang Chủ",
    href: "/menu",
  },
  {
    title: "Menu",
    href: "/guest/menu",
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
  const { role, setRole } = useAppContext();
  const logoutMutation = useLogoutMutation()
  const router = useRouter();
    const logout = async () => {
    if (logoutMutation.isPending) return
    try {
      await logoutMutation.mutateAsync()
      setRole(undefined)
      //console.log('[ui/logout] mutateAsync result:', res)
      // navigate after successful logout
        toast.success('Đăng xuất thành công')
        router.push('/')
    }catch(error:any){
      console.error('[ui/logout] mutation error:', error)
      handleErrorApi({error})
    }
  }
  return (
    <>
      {
        menuItems.map((item) => {
    //nav bar for logged in users
    const isAuth = item.role && role && item.role.includes(role);
    //nav bar for not logged in users
    const isUnauthenticated = (item.role === undefined && !item.hideWhenLogged) || (!role && item.hideWhenLogged);
    if (isAuth || isUnauthenticated) {
      return (
        <Link href={item.href} key={item.href} className={className}>
          {item.title}
        </Link>
      );
    }
    return null;
  })}
  
  {role && (<div className={cn(className, 'cursor-pointer')} onClick={logout}>
    Log Out
  </div>)}
    </>
  ) 
}
