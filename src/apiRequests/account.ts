import AddEmployee from "@/app/manage/accounts/add-employee";
import http from "@/lib/http";
import {
  AccountListResType,
  AccountResType,
  ChangePasswordBodyType,
  CreateEmployeeAccountBodyType,
  UpdateEmployeeAccountBodyType,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";

const prefix = "/accounts";
const accountApiRequest = {
  me: () => http.get<AccountResType>(`${prefix}/me`),
  updateMe: (body: UpdateMeBodyType) =>
    http.put<AccountResType>(`${prefix}/me`, body),
  changePwd: (body: ChangePasswordBodyType) =>
    http.put<AccountResType>(`${prefix}/change-password`, body),
  list: () => http.get<AccountListResType>(`${prefix}`),
  AddEmployee: (body: CreateEmployeeAccountBodyType) =>
    http.post<AccountResType>(prefix, body),
  updateEmployee: (id: number, body: UpdateEmployeeAccountBodyType) =>
    http.put<AccountResType>(`${prefix}/detail/${id}`, body),
  getEmployee: (id: number) =>
    http.get<AccountResType>(`${prefix}/detail/${id}`),
  deleteEmployee: (id: number) =>
    http.delete<AccountResType>(`${prefix}/detail/${id}`),
};
export default accountApiRequest;
