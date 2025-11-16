'use client'

import { getAccessTokenFromLocalStorage } from '@/lib/utils'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const menuItems = [
  {
    title: 'Món ăn',
    href: '/menu',
    authRequired: undefined // ai cũng thấy được
  },
  {
    title: 'Đơn hàng',
    href: '/orders',
    authRequired: true
  },
  {
    title: 'Đăng nhập',
    href: '/login',
    authRequired: false //chưa đăng nhập thì hiện 
  },
  {
    title: 'Quản lý',
    href: '/manage/dashboard',
    authRequired: true // đăn nhập rồi thì khỏi
  }
]


export default function NavItems({ className }: { className?: string }) {
  const [isAuth, setIsAuth] = useState(false)
  useEffect(() =>{
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAuth(Boolean(getAccessTokenFromLocalStorage()))
  }, [])
  return menuItems.map((item) => {
      if (item.authRequired === true && !isAuth || item.authRequired === false && isAuth) return null
    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    )
  })
}
