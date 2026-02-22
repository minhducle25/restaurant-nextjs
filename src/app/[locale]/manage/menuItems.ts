import { Role } from '@/constants/type'
import { Home, LineChart, ShoppingCart, Users2, Salad, Table } from 'lucide-react'
import { useTranslations } from 'next-intl'

type TFunction = ReturnType<typeof useTranslations>

const menuItems = (t: TFunction) => [
  {
    title: t('dashboard'),
    Icon: Home,
    href: '/manage/dashboard',
    roles: [Role.Owner, Role.Employee]
  },
  {
    title: t('orders'),
    Icon: ShoppingCart,
    href: '/manage/orders',
    roles: [Role.Owner, Role.Employee]
  },
  {
    title: t('tables'),
    Icon: Table,
    href: '/manage/tables',
    roles: [Role.Owner, Role.Employee]
  },
  {
    title: t('dishes'),
    Icon: Salad,
    href: '/manage/dishes',
    roles: [Role.Owner, Role.Employee]
  },
  {
    title: t('accounts'),
    Icon: Users2,
    href: '/manage/accounts',
    roles: [Role.Owner]
  }
]

export default menuItems
