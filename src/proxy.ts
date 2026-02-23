import { Role } from "@/constants/type";
import { TokenPayload } from "@/types/jwt.types";
import { NextResponse, NextRequest } from "next/server";
import createIntlMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

const publicPaths = ["/login"];
const managePath = ["/manage"]
const guestPath = ["/guest"]
const ownerPath = ["/manage/accounts"]
const privatePaths = [...managePath, ...guestPath];

const decodeToken = (token: string): TokenPayload | null => {
  try {
    // JWT format: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    // Decode the payload (middle part)
    const payload = parts[1];
    // Replace URL-safe characters and add padding if needed
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    
    // Decode from base64
    const jsonPayload = atob(paddedBase64);
    return JSON.parse(jsonPayload) as TokenPayload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Create the intl middleware
const intlMiddleware = createIntlMiddleware(routing);

// This function can be marked `async` if using `await` inside
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Remove locale prefix to check paths correctly
  const pathnameWithoutLocale = pathname.replace(/^\/(en|vi)/, '') || '/';

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  //1. redirect to login if accessing private path without refresh token
  if (privatePaths.some((path) => pathnameWithoutLocale.startsWith(path)) && !refreshToken) {
     const url = new URL("/login", request.url);
     url.searchParams.set('clearTokens', 'true')
     return NextResponse.redirect(url);
  }

  if(refreshToken){
    //2.1 redirect to home if accessing login path with refresh token
    if (publicPaths.some((path) => pathnameWithoutLocale.startsWith(path))) {
      return NextResponse.redirect(new URL("/", request.url));
  }
  //2.2 redirect to refresh token if access token is expired when accessing private path
  if (
    privatePaths.some((path) => pathnameWithoutLocale.startsWith(path)) &&
    !accessToken 
  ) {
    const url = new URL("/refresh-token", request.url);
    url.searchParams.set("refreshToken", refreshToken);
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url);
  }
  //2.3 Accessing paths not allowed for the role

  const role = decodeToken(refreshToken)?.role;

  //guest trying to access manage paths
  const isGuestAccessingManagePath = (role === Role.Guest && managePath.some((path) => pathnameWithoutLocale.startsWith(path)))
  const isNonGuestAccessingGuestPath = (role !== Role.Guest && guestPath.some((path) => pathnameWithoutLocale.startsWith(path)))

  //other connections not owner trying to access owner only path
  const isNotOwnerAccessingOwnerPath = (role !== Role.Owner && ownerPath.some((path) => pathnameWithoutLocale.startsWith(path)))

  if(isGuestAccessingManagePath || isNonGuestAccessingGuestPath || isNotOwnerAccessingOwnerPath){
    return NextResponse.redirect(new URL("/", request.url));
  }
}

  // Run intl middleware for locale handling
  return intlMiddleware(request);
}
 
export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};