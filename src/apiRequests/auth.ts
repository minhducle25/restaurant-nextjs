import http from "@/lib/http";
import { LoginBodyType, LoginResType, LogoutBodyType, RefreshTokenBodyType, RefreshTokenResType } from "@/schemaValidations/auth.schema";

const authApiRequests = {
    reFreshTokenRequest: null as Promise<{
        status: number;
        payload: RefreshTokenResType
    }> | null,
    sLogin: (body: LoginBodyType) => http.post<LoginResType>('/auth/login', body),
    login: (body: LoginBodyType) => http.post<LoginResType>('api/auth/login', body, 
    {baseUrl:''}),
    sLogout: (body: LogoutBodyType & {accessToken:string}) => http.post('/auth/logout', {refreshToken: body.refreshToken}, {headers: {
        'Authorization': `Bearer ${body.accessToken}`
    }}),
    logout: () => http.post('api/auth/logout', null, {baseUrl:''}), //client gọi đến route handler ko cần truyền token vì đã được gửi thông qua cookie
    sRefreshToken: (body: RefreshTokenBodyType) => http.post<RefreshTokenResType>('/auth/refresh-token', body),
    async refreshToken() {
        if(this.reFreshTokenRequest) {
            return this.reFreshTokenRequest
        }
        this.reFreshTokenRequest = http.post<RefreshTokenResType>('api/auth/refresh-token', null, {baseUrl:''})
        const result = await this.reFreshTokenRequest
        this.reFreshTokenRequest = null
        return result
    }
}
export default authApiRequests;