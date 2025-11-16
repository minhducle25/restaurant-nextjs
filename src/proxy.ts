import { NextResponse, NextRequest } from 'next/server'
 
const privatePaths = ['/manager']
const publicPaths = ['/login']
// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    const isAuth = Boolean(request.cookies.get('accessToken')?.value)

    if(privatePaths.some((path) => pathname.startsWith(path)) && !isAuth){
        return NextResponse.redirect(new URL('/login', request.url))
    }
    if(publicPaths.some((path) => pathname.startsWith(path)) && isAuth){
        return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
}

export const config = {
  matcher: ['/manager/:path*', '/login']
}