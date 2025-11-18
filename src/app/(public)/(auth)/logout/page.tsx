'use client'

import { getRefreshTokenFromLocalStorage } from "@/lib/utils"
import { useLogoutMutation } from "@/queries/useAuth"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import {  useEffect, useRef } from "react"

export default function LogoutPage() {
    const { mutateAsync } = useLogoutMutation()
    const router = useRouter()
    const searchParams = useSearchParams()
    const refreshTokenfromUrl = searchParams.get('refreshToken') || ''
    const ref = useRef<any>(null)
    useEffect(() => {
        if (ref.current || refreshTokenfromUrl !== getRefreshTokenFromLocalStorage() ) {return};
        ref.current = mutateAsync
        console.log(ref)
        mutateAsync().then((res) => {
            setTimeout(() => {
                ref.current = null
            }, 1000)    
            router.push('/login')
        })
    }, [mutateAsync, router, refreshTokenfromUrl])
    return (<div>Logging out...</div>)
}