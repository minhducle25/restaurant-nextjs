import { Role } from "@/constants/type";
import { TokenPayload } from "@/types/jwt.types";
import { NextResponse, NextRequest } from "next/server";
import  jwt  from "jsonwebtoken";


const publicPaths = ["/login"];
const managePath = ["/manage"]
const guestPath = ["/guest"]
const ownerPath = ["/manage/accounts"]
const privatePaths = [...managePath, ...guestPath];

const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload;
};

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;

  const refreshToken = request.cookies.get("refreshToken")?.value;

  //1. redirect to login if accessing private path without refresh token
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
     const url = new URL("/login", request.url);
     url.searchParams.set('clearTokens', 'true')
     return NextResponse.redirect(url);
  }

  if(refreshToken){
    //2.1 redirect to home if accessing login path with refresh token
    if (publicPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL("/", request.url));
  }
  //2.2 redirect to refresh token if access token is expired when accessing private path
  if (
    privatePaths.some((path) => pathname.startsWith(path)) &&
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
  const isGuestAccessingManagePath = (role === Role.Guest && managePath.some((path) => pathname.startsWith(path)))
  const isNonGuestAccessingGuestPath = (role !== Role.Guest && guestPath.some((path) => pathname.startsWith(path)))

  //other connections not owner trying to access owner only path
  const isNotOwnerAccessingOwnerPath = (role !== Role.Owner && ownerPath.some((path) => pathname.startsWith(path)))

  if(isGuestAccessingManagePath || isNonGuestAccessingGuestPath || isNotOwnerAccessingOwnerPath){
    return NextResponse.redirect(new URL("/", request.url));
  }
}

  return NextResponse.next();
}

export const config = {
  matcher: ["/manage/:path*", "/guest/:path*", "/login"],
};