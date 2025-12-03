import http from "@/lib/http";
import { LogoutBodyType, RefreshTokenBodyType, RefreshTokenResType } from "@/schemaValidations/auth.schema";
import { GuestCreateOrdersBodyType, GuestCreateOrdersResType, GuestGetOrdersResType, GuestLoginBodyType, GuestLoginResType } from "@/schemaValidations/guest.schema";

const guestApiRequests = {
    reFreshTokenRequest: null as Promise<{
        status: number;
        payload: RefreshTokenResType
    }> | null,
    sLogin: (body: GuestLoginBodyType) => http.post<GuestLoginResType>('/guest/auth/login', body),
    login: (body: GuestLoginBodyType) => http.post<GuestLoginResType>('api/guest/auth/login', body, 
    {baseUrl:''}),
    sLogout: (body: LogoutBodyType & {accessToken:string}) => http.post('/guest/auth/logout', {refreshToken: body.refreshToken}, {headers: {
        'Authorization': `Bearer ${body.accessToken}`
    }}),
    logout: () => http.post('api/guest/auth/logout', null, {baseUrl:''}), //client gọi đến route handler ko cần truyền token vì đã được gửi thông qua cookie
    sRefreshToken: (body: RefreshTokenBodyType) => http.post<RefreshTokenResType>('/guest/auth/refresh-token', body),
    async refreshToken() {
        if(this.reFreshTokenRequest) {
            return this.reFreshTokenRequest
        }
        this.reFreshTokenRequest = http.post<RefreshTokenResType>('api/guest/auth/refresh-token', null, {baseUrl:''})
        const result = await this.reFreshTokenRequest
        this.reFreshTokenRequest = null
        return result
    },
    placeOrder: (body: GuestCreateOrdersBodyType) => http.post<GuestCreateOrdersResType>('/guest/orders', body),
    getOrderList: () => http.get<GuestGetOrdersResType>('/guest/orders'),
}
export default guestApiRequests;