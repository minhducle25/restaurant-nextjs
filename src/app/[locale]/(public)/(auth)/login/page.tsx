import LoginForm from '@/app/[locale]/(public)/(auth)/login/login-form'
import NavItems from '@/app/[locale]/(public)/nav-items'
import { SwitchLanguage } from '@/components/switch-language'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'

export default function Login() {
  return (
    <div className='fixed inset-0 z-50 bg-[#0a0f1c] text-white font-sans'>
      {/* Background image */}
      <Image
        src='https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
        alt='Restaurant interior background'
        fill
        priority
        sizes='100vw'
        className='object-cover'
      />
      <div className='absolute inset-0 bg-[#0a0f1c]/75' />

      {/* Navbar */}
      <nav className='absolute top-0 w-full z-20 px-4 md:px-6 py-3 flex items-center justify-between bg-linear-to-b from-black/80 to-transparent pointer-events-none'>
        <div className='flex items-center gap-4 md:gap-8 pointer-events-auto'>
          <Link href='/' className='flex items-center gap-2 shrink-0'>
            <div className='w-9 h-9 bg-linear-to-tr from-orange-600 to-orange-400 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow-[0_0_15px_rgba(249,115,22,0.5)] hover:scale-105 transition-transform'>
              M
            </div>
            <span className='text-white text-xl font-black tracking-tight hidden sm:block'>Minu Kitchen</span>
          </Link>
          <div className='hidden md:flex items-center gap-5 text-sm font-medium text-slate-300'>
            <NavItems className='hover:text-orange-400 transition-colors' />
          </div>
        </div>
        <div className='pointer-events-auto'>
          <SwitchLanguage />
        </div>
      </nav>

      {/* Form centered */}
      <div className='absolute inset-0 z-10 flex items-center justify-center px-4'>
        <LoginForm />
      </div>
    </div>
  )
}
