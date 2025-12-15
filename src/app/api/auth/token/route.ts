import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { HttpError } from "@/lib/http";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    accessToken: string,
    refreshToken: string
  };
  const { accessToken, refreshToken } = body;
  const cookieStore = await cookies();
  try {
    const decodedAccessToken = jwt.decode(accessToken) as { exp: number };
    const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number };
    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      // only secure in production (localhost over http won't store secure cookies)
      secure: process.env.NODE_ENV === 'production',
      sameSite: "lax",
      path: "/",
      expires: new Date(decodedAccessToken.exp * 1000),
    });

    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "lax",
      path: "/",
      expires: new Date(decodedRefreshToken.exp * 1000),
    });
    return Response.json(body);
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      });
    } else {
      return Response.json({ message: "Có lỗi" }, { status: 500 });
    }
  }
}
