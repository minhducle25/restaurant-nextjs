import http from "@/lib/http";
import { CreateTableBodyType, TableListResType, TableResType, UpdateTableBodyType } from "@/schemaValidations/table.schema";

const prefix = '/tables';
const tableApiRequest = {
    list: () => http.get<TableListResType>(`${prefix}`),
    add: (body: CreateTableBodyType) => http.post<TableResType>(`${prefix}`, body),
    get: (number: number) => http.get<TableResType>(`${prefix}/${number}`),
    update: (number: number, body: UpdateTableBodyType) => http.put<TableResType>(`${prefix}/${number}`, body),
    delete: (number: number) => http.delete<TableResType>(`${prefix}/${number}`),
}

export default tableApiRequest;