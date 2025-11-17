import http from "@/lib/http";
import { AccountResType, ChangePasswordBodyType, UpdateMeBodyType } from "@/schemaValidations/account.schema";

const accountApiRequest ={
    me: () => http.get<AccountResType>('/accounts/me'),
    updateMe: (body: UpdateMeBodyType) => http.put<AccountResType>('/accounts/me', body),
    changePwd: (body: ChangePasswordBodyType) => http.put<AccountResType>('/accounts/change-password', body)
}
export default accountApiRequest;
