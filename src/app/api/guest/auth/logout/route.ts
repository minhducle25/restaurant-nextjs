import { cookies } from "next/headers";
import guestApiRequests from "@/apiRequests/guest";

export async function POST() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  console.log('[api/auth/logout] cookies before delete:', { accessToken, refreshToken });
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  if (!accessToken || !refreshToken) {
    return Response.json({ message: "No Token" }, { status: 200 });
  }
  try {
    const result = await guestApiRequests.sLogout({ refreshToken, accessToken });
    //console.log('[api/auth/logout] backend result:', result)
    return Response.json({ success: true, backend: result.payload }, { status: 200 });
  } catch (error) {
    //console.error('[api/auth/logout] error calling backend:', error);
    return Response.json(
      { message: "Failed calling to backend server", detail: String(error) },
      { status: 500 }
    );
  }
}
