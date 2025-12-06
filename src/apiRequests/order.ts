import http from "@/lib/http";
import { GetOrderDetailResType, GetOrdersQueryParamsType, GetOrdersResType, UpdateOrderBodyType, UpdateOrderResType } from "@/schemaValidations/order.schema";
import queryString from "querystring";

const orderApiRequest = {
    getOrderList: (queryParams: GetOrdersQueryParamsType) => {
        // Chuyển Date thành ISO string trước khi stringify
        // const params = {
        //     ...queryParams,
        //     fromDate: queryParams.fromDate?.toISOString(),
        //     toDate: queryParams.toDate?.toISOString()
        // };
        return http.get<GetOrdersResType>('/orders?' + queryString.stringify({
            fromDate: queryParams.fromDate?.toISOString(),
            toDate: queryParams.toDate?.toISOString(),
        }));
    },
    updateOrder: (orderId: number, body: UpdateOrderBodyType) => http.put<UpdateOrderResType>(`/orders/${orderId}`, body),
    getOrderDetail: (orderId: number) => http.get<GetOrderDetailResType>(`/orders/${orderId}`),
}

export default orderApiRequest;