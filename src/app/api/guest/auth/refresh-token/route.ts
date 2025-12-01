import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import guestApiRequests from "@/apiRequests/guest";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  if(!refreshToken){
    return Response.json({ message: "No Refresh Token" }, { status: 401 });
  }
  try {
    const { payload } = await guestApiRequests.sRefreshToken({ refreshToken });

    const decodedAccessToken = jwt.decode(payload.data.accessToken) as { exp: number };
    const decodedRefreshToken = jwt.decode(payload.data.refreshToken) as { exp: number };
    cookieStore.set("accessToken", payload.data.accessToken, {
      httpOnly: true,
      // only secure in production (localhost over http won't store secure cookies)
      secure: process.env.NODE_ENV === 'production',
      sameSite: "lax",
      path: "/",
      expires: new Date(decodedAccessToken.exp * 1000),
    });

    cookieStore.set("refreshToken", payload.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "lax",
      path: "/",
      expires: new Date(decodedRefreshToken.exp * 1000),
    });
    return Response.json(payload);
  } catch (error: any) {
      return Response.json({ message: `Có lỗi: ${error.message}` }, { status: 401 });
    }
  }
