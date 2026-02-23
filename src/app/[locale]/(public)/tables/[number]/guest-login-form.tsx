'use client'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GuestLoginBody, GuestLoginBodyType } from '@/schemaValidations/guest.schema'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useGuestLoginMutation } from '@/queries/useGuest'
import { useAppStore } from '@/components/app-provider'
import { generateSocketInstance, handleErrorApi } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import NavItems from '@/app/[locale]/(public)/nav-items'
import { SwitchLanguage } from '@/components/switch-language'

export default function GuestLoginForm() {
  const t = useTranslations('GuestLogin')
  const setRole = useAppStore((state) => state.setRole)
  const setSocket = useAppStore((state) => state.setSocket)

  const searchParams = useSearchParams()
  const params = useParams()
  const tableNumber = Number(params.number)
  const token = searchParams.get('token')
  const router = useRouter()
  const loginMutation = useGuestLoginMutation()

  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      name: '',
      token: token ?? '',
      tableNumber
    }
  })

  useEffect(() => {
    if (!token) {
      router.push('/')
    }
  }, [token, router])

  async function onSubmit(values: GuestLoginBodyType) {
    if (loginMutation.isPending) return
    try {
      const res = await loginMutation.mutateAsync(values)
      setRole(res.payload.data.guest.role)
      setSocket(generateSocketInstance(res.payload.data.accessToken))
      router.push('/guest/menu')
    } catch (error) {
      handleErrorApi({ error, setError: form.setError })
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0f1c] text-white font-sans">
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .guest-fade-in { animation: fade-in 0.5s ease-out forwards; }
      `}</style>

      {/* Background image */}
      <Image
        src="https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        alt="Restaurant background"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-[#0a0f1c]/75" />

      {/* Navbar */}
      <nav className="absolute top-0 w-full z-20 px-4 md:px-6 py-3 flex items-center justify-between bg-linear-to-b from-black/80 to-transparent pointer-events-none">
        <div className="flex items-center gap-4 md:gap-8 pointer-events-auto">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-linear-to-tr from-orange-600 to-orange-400 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow-[0_0_15px_rgba(249,115,22,0.5)] hover:scale-105 transition-transform">
              M
            </div>
            <span className="text-white text-xl font-black tracking-tight hidden sm:block">Minu Kitchen</span>
          </div>
          <div className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-300">
            <NavItems className="hover:text-orange-400 transition-colors" />
          </div>
        </div>
        <div className="pointer-events-auto">
          <SwitchLanguage />
        </div>
      </nav>

      {/* Card area */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
        <div className="guest-fade-in w-full max-w-sm p-8 rounded-2xl backdrop-blur-xl border shadow-2xl bg-[#1a2035]/80 border-slate-700/50">

          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-10 h-10 bg-linear-to-tr from-orange-600 to-orange-400 rounded-xl flex items-center justify-center text-white font-extrabold text-base shadow-[0_0_15px_rgba(249,115,22,0.5)]">
              M
            </div>
            <span className="text-xl font-black tracking-tight text-white">Minu Kitchen</span>
          </div>

          <h2 className="text-2xl font-bold mb-6 text-center text-white">
            {t('title')}
          </h2>

          <Form {...form}>
            <form
              className="flex flex-col gap-5"
              noValidate
              onSubmit={form.handleSubmit(onSubmit, console.log)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="name" className="text-sm font-semibold text-slate-300">
                        {t('fieldName')}
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder={t('fieldNamePlaceholder')}
                        required
                        {...field}
                        className="px-4 py-3 rounded-xl border bg-[#0a0f1c]/50 border-slate-700 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-orange-500 transition-all"
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full mt-1 py-3 rounded-xl bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-lg shadow-[0_4px_15px_rgba(249,115,22,0.4)] transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loginMutation.isPending ? '...' : t('submit')}
              </button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
