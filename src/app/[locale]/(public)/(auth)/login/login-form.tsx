'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { LoginBody, LoginBodyType } from '@/schemaValidations/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLoginMutation } from '@/queries/useAuth'
import { toast } from 'sonner'
import { generateSocketInstance, handleErrorApi } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAppStore } from '@/components/app-provider'
import evnConfig from '@/config'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import SearchParamsLoader, { useSearchParamsLoader } from '@/components/search-params-loader'

const getOauthGoogleUrl = () => {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
  const options = {
    redirect_uri: evnConfig.NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI,
    client_id: evnConfig.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ].join(' ')
  }
  const qs = new URLSearchParams(options)
  return `${rootUrl}?${qs.toString()}`

}

const googleOauthUrl = getOauthGoogleUrl()

export default function LoginForm() {
  const t = useTranslations("Login");
  const errorMessageT = useTranslations("ErrorMessage");
  const loginMutation = useLoginMutation()
  // const searchParams = useSearchParams()
  const {searchParams, setSearchParams} = useSearchParamsLoader();
  const clearTokens = searchParams?.get('clearTokens')
    const setRole = useAppStore((state) => state.setRole);
    const setSocket = useAppStore((state) => state.setSocket);

  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: '',
      password: ''
    }
  })
  const router = useRouter()
  useEffect(() => {
    if (clearTokens) {
      setRole(undefined)
    }
  }, [clearTokens, setRole])
  const onSubmit = async (data: LoginBodyType) => {
    if (loginMutation.isPending) return
    try {
      const result = await loginMutation.mutateAsync(data)
      toast.success(t('loginSuccess'))
      setRole(result.payload.data.account.role)
      router.push('/manage/dashboard')
      const socketInstance = generateSocketInstance(result.payload.data.accessToken)
      setSocket(socketInstance)
    } catch (error: any) {
      handleErrorApi({ error, setError: form.setError })
    }
  }
  return (
    <div className='w-full max-w-sm p-8 rounded-2xl backdrop-blur-xl border shadow-2xl bg-[#1a2035]/80 border-slate-700/50'>
      <SearchParamsLoader onParamsReceived={setSearchParams} />

      {/* Logo */}
      <div className='flex items-center justify-center gap-2 mb-6'>
        <div className='w-10 h-10 bg-linear-to-tr from-orange-600 to-orange-400 rounded-xl flex items-center justify-center text-white font-extrabold text-base shadow-[0_0_15px_rgba(249,115,22,0.5)]'>
          M
        </div>
        <span className='text-xl font-black tracking-tight text-white'>Minu Kitchen</span>
      </div>

      <h2 className='text-2xl font-bold mb-1 text-center text-white'>{t('title')}</h2>
      <p className='text-sm text-slate-400 text-center mb-6'>{t('description')}</p>

      <Form {...form}>
        <form className='flex flex-col gap-4' noValidate onSubmit={form.handleSubmit(onSubmit, err => { console.warn(err) })}>
          <FormField
            control={form.control}
            name='email'
            render={({ field, formState: { errors } }) => (
              <FormItem>
                <div className='flex flex-col gap-1.5'>
                  <Label htmlFor='email' className='text-sm font-semibold text-slate-300'>{t('email')}</Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='m@example.com'
                    required
                    {...field}
                    className='px-4 py-3 rounded-xl border bg-[#0a0f1c]/50 border-slate-700 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-orange-500 transition-all'
                  />
                  <FormMessage>
                    {Boolean(errors.email?.message) && errorMessageT(errors.email?.message as any)}
                  </FormMessage>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field, formState: { errors } }) => (
              <FormItem>
                <div className='flex flex-col gap-1.5'>
                  <Label htmlFor='password' className='text-sm font-semibold text-slate-300'>{t('password')}</Label>
                  <Input
                    id='password'
                    type='password'
                    required
                    {...field}
                    className='px-4 py-3 rounded-xl border bg-[#0a0f1c]/50 border-slate-700 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-orange-500 transition-all'
                  />
                  <FormMessage>
                    {Boolean(errors.password?.message) && errorMessageT(errors.password?.message as any)}
                  </FormMessage>
                </div>
              </FormItem>
            )}
          />

          <button
            type='submit'
            disabled={loginMutation.isPending}
            className='w-full mt-1 py-3 rounded-xl bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-base shadow-[0_4px_15px_rgba(249,115,22,0.4)] transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed'
          >
            {loginMutation.isPending ? '...' : t('submit')}
          </button>

          <Link href={googleOauthUrl}>
            <button
              type='button'
              className='w-full py-3 rounded-xl border border-slate-600 bg-white/5 hover:bg-white/10 text-white font-semibold text-base transition-all'
            >
              {t('loginWithGoogle')}
            </button>
          </Link>
        </form>
      </Form>
    </div>
  )
}
